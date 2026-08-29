# Sistema visual Nen

Nen representa visualmente el método operativo de YC Systems. No es un chatbot, un empleado ficticio ni una mascota decorativa que se repite sin propósito.

## Fuentes de verdad

- `config/nen-system.json`: modos, alias, expresiones, poses, tamaños, movimiento y registro de assets.
- `scripts/build-site.mjs`: estructura estática y componentes reutilizables.
- `site/nen-controller.js`: transiciones de estado, interacción, mirada, parpadeo, feedback de formularios y visibilidad.
- `site/styles/nen.css`: personaje, expresiones, señales, componentes, movimiento y comportamiento responsive.
- `/nen-lab/`: galería de validación sin enlace público y con `noindex`.

## Modos canónicos

| Modo | Etiqueta | Expresión base | Pose base |
| --- | --- | --- | --- |
| `observe` | Observando | `observing` | `observing` |
| `organize` | Ordenando | `thinking` | `analyzing` |
| `design` | Diseñando | `designing` | `designing` |
| `build` | Construyendo | `building` | `building` |
| `support` | Acompañando | `support-neutral` | `supporting` |

Los nombres heredados como `connect`, `monitor` y `activate` se normalizan mediante alias. El trabajo nuevo debe usar los nombres canónicos.

## Componentes reutilizables

- `nenCharacter`: imagen base, visor controlado, expresión, señal de pose, tamaño, chip, mensaje y acción.
- `nenStatusChip`: estado operativo breve.
- `nenCore`: presencia compacta donde un personaje completo competiría con el contenido.
- `nenGuideCard`: explicación contextual asociada con opciones cercanas.
- `nenInsightCard`: observación o conclusión.
- `nenConfirmation`: ruta terminada o acción correcta.
- `nenLoader`: estado breve de procesamiento.
- `nenEmptyState`: ausencia útil con próximo paso.

## API de estado

Los elementos usan estos atributos:

```html
data-nen
data-nen-state="organize"
data-nen-expression="thinking"
data-nen-pose="analyzing"
```

`setNenState(element, state, message, options)` actualiza en conjunto el modo canónico, etiqueta, expresión, pose, tono de feedback, mensaje visible y chip de estado.

Cada expresión cambia al menos dos señales entre ojos, boca, mirada, inclinación, manos e iluminación. Color y texto nunca son la única diferencia.

## Expresiones

El catálogo independiente contiene exactamente estas doce expresiones: `neutral`, `happy`, `curious`, `thinking`, `explaining`, `greeting`, `waiting`, `confirming`, `soft-alert`, `empty`, `processing` y `celebration`.

`support-neutral` es la expresión operativa del modo Acompañando. `confirming` se reserva para confirmaciones completadas; Nen no mantiene los ojos cerrados durante soporte continuo.

## Movimiento y accesibilidad

- El parpadeo ocurre en intervalos aleatorios de 4 a 8 segundos.
- La mirada sigue el puntero solo unos pocos píxeles y únicamente con puntero fino.
- La rotación de cabeza y pose se mantiene contenida.
- La entrada se ejecuta una vez y nunca deja contenido oculto como estado base.
- El movimiento se pausa fuera del viewport y mientras el documento está oculto.
- `prefers-reduced-motion`, impresión, ausencia de `IntersectionObserver` o fallo del controlador muestran todo inmediatamente y desactivan la animación.
- El estado nunca se comunica solo mediante color.

## Fallback estático

El HTML y la imagen oficial se muestran sin JavaScript. Si el controlador no carga, `nen-static-fallback` detiene el movimiento y conserva un estado neutral legible. Ningún contenido o control esencial depende de Nen.

## Registro de assets

`config/nen-system.json` registra cada asset y su estado. El renderer utiliza el asset específico únicamente cuando está marcado como listo; de lo contrario emplea la base oficial y las señales vectoriales/CSS de la pose.

Listos:

- `nen-avatar-clean`: avatar público actual de Nen, limpio y sin gesto promocional.
- `nen-avatar-base`: raster anterior, reservado para confirmaciones y fallback temporal.
- `nen-face-support-neutral`: rostro generado en CSS.
- `nen-face-confirming`: rostro generado en CSS.
- `nen-face-soft-alert`: rostro generado en CSS.
- `nen-face-waiting`: rostro generado en CSS.

Pendientes de producción raster:

- `nen-pose-designing`: Nen trabajando con stylus y wireframe.
- `nen-pose-building`: Nen ensamblando módulos o usando una herramienta.

El namespace técnico `nen-*` se conserva por compatibilidad interna; la identidad pública es Nen. Las poses faltantes están registradas y cuentan con fallback visual en CSS hasta que existan fuentes oficiales transparentes.

No se deben extraer imágenes de los PDF de referencia ni usar la hoja antigua de expresiones como sprite de producción.
