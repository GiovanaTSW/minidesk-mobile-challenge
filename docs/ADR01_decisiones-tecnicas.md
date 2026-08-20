# ADR01_decisiones-tecnicas
## Mercatto ☼ | Minidesk dev mobile challenge

---

# ADR-01: decisiones a justificar del proyecto

Prueba de demostración de habilidades técnicas para la empresa 'Minidesk'

| Campo  | Valor |
|--------|-------|
| Autor  | Giovana Ruby Díaz Anduze |
| Fecha  | 20/08/2026 |
| Estado | `Propuesto` |

---

**↩ [Volver al README](../README.md)**

## 4.1. Manejo de estado global

### Elige entre Zustand o Redux e impleméntalo.

Elegí **Zustand**, implementado en un único store para el carrito (`src/store/useCartStore.ts`).

### ¿Por qué ese y no el otro? ¿Bajo qué circunstancias habrías elegido el otro?

El único dominio de estado global real de esta app es el carrito: no hay sesión de usuario, ni múltiples entidades que coordinar entre sí. Redux hubiera significado configurar un provider, slices y actions para manejar, en el fondo, un arreglo y cinco funciones. Zustand da un hook directo, sin provider, con selectores nativos que resuelven exactamente el problema de rendimiento que explico más abajo.

Habría elegido Redux si el proyecto necesitara coordinar varios dominios de estado con lógica compartida entre ellos (por ejemplo, carrito + sesión + historial de órdenes + notificaciones), o si ya existiera una convención de equipo en Redux Toolkit que valiera la pena mantener por consistencia.

### ¿Qué información vive en el estado global y qué no? ¿Por qué?

En el estado global vive únicamente `items` (producto y cantidad) junto con las acciones que lo modifican: agregar, aumentar, disminuir, eliminar y vaciar.

El catálogo de productos **no** vive en Zustand, porque es un dato de servidor con su propio ciclo de vida (fetch, cache, revalidación), y meterlo en el store hubiera duplicado la fuente de verdad frente a TanStack Query, con el riesgo de que ambas copias se desincronizaran.

### Con los controles del carrito repartidos en tres pantallas, ¿qué consideraciones de rendimiento tuviste y cómo las resolviste?

Cada componente que necesita la cantidad de un producto puntual usa un selector escalar (`useCartStore((state) => state.items.find(...)?.quantity ?? 0)`, encapsulado en el hook `useCartItem`), en vez de suscribirse al arreglo `items` completo. Así, cuando cambia la cantidad de un producto, solo se re-renderiza esa fila específica — no el listado completo ni el carrito entero. El badge del header, que muestra el total acumulado, lee `totalItems()` de la misma forma, como valor derivado independiente.

*Nota sobre la estructura de datos:* el carrito se modela como `items: CartItem[]` (arreglo), recorrido con `.find()`/`.map()` en cada lectura o escritura. Con un catálogo de 20 productos ese costo es imperceptible, y un arreglo se mapea directamente a `FlatList` sin transformación adicional. Si el catálogo creciera considerablemente, la mejora natural sería migrar a un `Record<number, CartItem>` indexado por id, para acceso directo en vez de recorrer la lista.

---

## 4.2. Navegación y rutas dinámicas

### Puedes usar Expo Router o el enfoque legacy con React Navigation.

Elegí **Expo Router** (basado en archivos), con un grupo de ruta `(shop)` que separa el flujo de tienda de la pantalla de bienvenida.

### Justifica la elección y describe tu estructura de rutas.

El requisito de que el detalle de producto funcione al abrirse directamente es, en esencia, pedir deep linking correcto. Expo Router lo resuelve por convención: `app/(shop)/product/[id].tsx` es una ruta real que funciona igual si se llega navegando desde el listado o abriendo la URL directamente, sin necesidad de configurar `linking` a mano como sí habría que hacer con React Navigation puro.

Estructura de rutas:

```
/ → Bienvenida
/(shop) → Catálogo
/(shop)/product/[id] → Detalle (ruta dinámica)
/(shop)/cart → Carrito
/(shop)/checkout → Pago mock
/(shop)/success → Confirmación
```


El grupo `(shop)` no aparece en la URL final; solo agrupa el flujo de tienda bajo su propio `Stack`, separado de la bienvenida.

### Explica cómo manejas los parámetros de la ruta dinámica y el stack de navegación del flujo completo.

El parámetro se lee con `useLocalSearchParams()` y se convierte a número antes de pasarlo a `useProduct(productId)`. Si el id no corresponde a ningún producto —ni en la API ni en el catálogo de respaldo—, la pantalla muestra un estado de error explícito con opción de volver, en vez de romperse.

Para el stack de navegación, uso `router.push` en cada paso normal del flujo (listado → detalle → carrito → checkout), lo que conserva el historial y permite regresar con el botón atrás. La excepción es el paso de checkout a success, donde uso `router.replace()`: esto saca la pantalla de checkout del stack, así que al llegar a la confirmación, el botón atrás ya no puede regresar a un pago ya procesado. Aplico la misma lógica al volver de success al catálogo, para que tampoco se pueda regresar a la pantalla de confirmación una vez que el usuario decide seguir comprando.

---

## 4.3. Caché del lado del cliente

### Explica tu estrategia de cache, cómo la configuraste y por qué con esos valores.

Uso **TanStack Query**, configurado en un `QueryClient` global (`app/_layout.tsx`):

```ts
staleTime: 1000 * 60 * 5   // 5 minutos
gcTime: 1000 * 60 * 30     // 30 minutos
retry: 2
```

El catálogo de la Fake Store API es prácticamente estático durante una sesión de compra, así que tratarlo como "fresco" por 5 minutos evita refetch innecesario mientras el usuario navega entre listado y detalle, sin riesgo real de mostrar datos desactualizados. Los 30 minutos de `gcTime` mantienen los datos en memoria el tiempo suficiente para navegar de un lado a otro sin volver a pedirlos de la red, sin retenerlos indefinidamente. El `retry: 2` absorbe caídas puntuales de la API antes de mostrar el estado de error al usuario, respondiendo directamente a la advertencia del enunciado sobre fallos intermitentes.

### ¿Qué criterio usaste para decidir qué datos cachear y cuáles no?

Solo se cachea lo que viene del servidor: el listado y el detalle de producto. El carrito **no** pasa por TanStack Query, porque no es un dato que se "revalide" contra un servidor — es estado de cliente puro que vive en Zustand y es la fuente de verdad en sí misma, no una copia de algo externo.

---

## 4.4. Custom hooks

### Crea los custom hooks que consideres necesarios y explica qué problema resuelve cada uno.

- **`useCartItem(productId)`** — en el listado y en el detalle, cada tarjeta de producto necesita saber su propia cantidad en el carrito y decidir si muestra el botón "Add to cart" o el stepper +/-. Este hook encapsula esa lógica condicional para que no se repita en cada pantalla.

- **`useCartTotals()`** — el subtotal, impuesto y total se calculan igual en la pantalla del carrito y en el checkout. Sin este hook, cualquier ajuste a la fórmula habría que replicarlo en dos lugares, con riesgo de que el total mostrado en ambas pantallas se desincronice. Está memoizado con `useMemo` para no recalcular si `items` no cambió.

- **`useProducts()` / `useProduct(id)`** — encapsulan la configuración de TanStack Query (query keys, función de fetch) para que las pantallas no conozcan los detalles de la librería de cache, solo consuman `{ data, isLoading, isError }`.

### Buscamos hooks que aporten valor real, no abstracciones decorativas.

No agregué hooks adicionales "por completitud". Cada uno de los tres resuelve un problema concreto de duplicación de lógica o de rendimiento (evitar re-renders innecesarios) — ninguno es un simple wrapper que solo mueve código de un archivo a otro sin resolver nada.

---

## 4.5. Capa de datos y peticiones a la API

### La librería o método para las peticiones HTTP queda a tu criterio. Justifica la elección.

Elegí `fetch` nativo, envuelto en un cliente propio (`src/services/api.ts`), sin librería adicional de HTTP. Con solo dos endpoints GET, sin autenticación ni headers especiales, una librería como Axios no resuelve nada que un wrapper de pocas líneas no resuelva ya. Preferí no sumar una dependencia para una superficie tan pequeña.

### Explica cómo organizaste la comunicación con la API y cómo manejas los errores.

Toda la comunicación pasa por `src/services/api.ts`, que expone `getProducts()` y `getProductById(id)`. Ninguna pantalla hace `fetch` directo — siempre pasan por los hooks (`useProducts`, `useProduct`), que son los únicos consumidores de este servicio.

Cuando una petición falla, la interfaz no se queda en blanco ni muestra un error crudo: recurre a `MOCK_PRODUCTS` como catálogo de respaldo y muestra un `OfflineBanner` para dejar claro que los datos no vienen del servidor en ese momento. Es mi respuesta directa a la advertencia del enunciado sobre fallos intermitentes: en vez de bloquear al usuario, la app degrada a un modo funcional sin conexión. El detalle de producto sigue la misma lógica — si la API falla, busca el id dentro del catálogo mock antes de mostrar un error real de "producto no encontrado".

---

### 4.6 Calidad general

### TypeScript obligatorio.

Todo el proyecto está escrito en TypeScript con modo `strict` activado.

### Estructura de carpetas coherente y explicada en el README.

La organización por capas (servicios, estado, hooks, vistas) está detallada en el README, en la sección "Por qué esta organización".

### La UI es libre. No evaluamos gusto estético, evaluamos consistencia y usabilidad.

La interfaz usa una paleta propia (granate `#4e0a0b` y rosa `#e38792`, bautizada "Mercatto"), aplicada de forma consistente en las seis pantallas del flujo: mismo header, mismos botones de acción, mismo tratamiento de estados de carga y error. Se priorizó que el usuario reconozca patrones repetidos entre pantallas por sobre un estilo visual particular.

---

## Decisiones ambiguas

- **Campos de envío en el checkout** (dirección, ciudad, código postal, teléfono): no existen en el modelo de la Fake Store API. El enunciado aclara que ese tipo de elementos puede simularse libremente, así que los agregué para dar un checkout más realista, sin ningún procesamiento real detrás.

- **"Cancel" en el checkout no vacía el carrito.** A diferencia de confirmar el pago —que sí limpia el carrito y bloquea el regreso—, cancelar solo regresa al catálogo conservando la selección. Asumí que alguien que cancela probablemente quiere retomar la compra después, no perder lo que ya eligió.

- **Acceso directo a `/success` sin pasar por un checkout confirmado no está bloqueado.** El requisito 3.5 exige que no se pueda volver a un checkout ya procesado (resuelto con `router.replace`), pero no exige proteger el acceso directo a la confirmación — lo dejé así de forma consciente, no por descuido.

- **Idioma de la interfaz:** se dejó en inglés en toda la aplicación. La Fake Store API devuelve los datos de productos (títulos, descripciones, categorías) en inglés, y traducir solo el texto propio de la UI mientras el contenido dinámico queda en inglés hubiera generado una mezcla inconsistente entre pantallas. Se priorizó esa consistencia por sobre adaptar el idioma al origen de la empresa (México), tal como pide el punto 4.6 del enunciado.

**↩ [Volver al README](../README.md)**