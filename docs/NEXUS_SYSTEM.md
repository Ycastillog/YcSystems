# Sistema visual Nexus

Nexus representa visualmente el método operativo de YC Systems. No es un chatbot, un empleado ficticio ni una mascota decorativa que se repite sin propósito.

## Fuentes de verdad

- `config/nexus-system.json`: modos, alias, expresiones, poses, tamaños, movimiento y registro de assets.
- `scripts/build-site.mjs`: estructura estática y componentes reutilizables.
- `site/nexus-controller.js`: transiciones de estado, interacción, mirada, parpadeo, feedback de formularios y visibilidad.
- `site/styles/nexus.css`: personaje, expresiones, señales, componentes, movimiento y comportamiento responsive.
- `/nexus-lab/`: galería de validación sin enlace público y con `noindex`.

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

- `nexusCharacter`: imagen base, visor controlado, expresión, señal de pose, tamaño, chip, mensaje y acción.
- `nexusStatusChip`: estado operativo breve.
- `nexusCore`: presencia compacta donde un personaje completo competiría con el contenido.
- `nexusGuideCard`: explicación contextual asociada con opciones cercanas.
- `nexusInsightCard`: observación o conclusión.
- `nexusConfirmation`: ruta terminada o acción correcta.
- `nexusLoader`: estado breve de procesamiento.
- `nexusEmptyState`: ausencia útil con próximo paso.

## API de estado

Los elementos usan estos atributos:

```html
data-nexus
data-nexus-state="organize"
data-nexus-expression="thinking"
data-nexus-pose="analyzing"
```

`setNexusState(element, state, message, options)` actualiza en conjunto el modo canónico, etiqueta, expresión, pose, tono de feedback, mensaje visible y chip de estado.

Cada expresión cambia al menos dos señales entre ojos, boca, mirada, inclinación, manos e iluminación. Color y texto nunca son la única diferencia.

## Expresiones

El catálogo independiente contiene exactamente estas doce expresiones: `neutral`, `happy`, `curious`, `thinking`, `explaining`, `greeting`, `waiting`, `confirming`, `soft-alert`, `empty`, `processing` y `celebration`.

`support-neutral` es la expresión operativa del modo Acompañando. `confirming` se reserva para confirmaciones completadas; Nexus no mantiene los ojos cerrados durante soporte continuo.

## Movimiento y accesibilidad

- El parpadeo ocurre en intervalos aleatorios de 4 a 8 segundos.
- La mirada sigue el puntero solo unos pocos píxeles y únicamente con puntero fino.
- La rotación de cabeza y pose se mantiene contenida.
- La entrada se ejecuta una vez y nunca deja contenido oculto como estado base.
- El movimiento se pausa fuera del viewport y mientras el documento está oculto.
- `prefers-reduced-motion`, impresión, ausencia de `IntersectionObserver` o fallo del controlador muestran todo inmediatamente y desactivan la animación.
- El estado nunca se comunica solo mediante color.

## Fallback estático

El HTML y la imagen oficial se muestran sin JavaScript. Si el controlador no carga, `nexus-static-fallback` detiene el movimiento y conserva un estado neutral legible. Ningún contenido o control esencial depende de Nexus.

## Registro de assets

`config/nexus-system.json` registra cada asset y su estado. El renderer utiliza el asset específico únicamente cuando está marcado como listo; de lo contrario emplea la base oficial y las señales vectoriales/CSS de la pose.

Listos:

- `nexus-avatar-base`: raster oficial actual.
- `nexus-face-support-neutral`: rostro generado en CSS.
- `nexus-face-confirming`: rostro generado en CSS.
- `nexus-face-soft-alert`: rostro generado en CSS.
- `nexus-face-waiting`: rostro generado en CSS.

Pendientes de producción raster:

- `nexus-avatar-clean`: busto transparente sin pulgar, mano o sombra residual.
- `nexus-pose-designing`: Nexus trabajando con stylus y wireframe.
- `nexus-pose-building`: Nexus ensamblando módulos o usando una herramienta.

El raster actual es opaco y ya contiene un gesto de pulgar. Para no alterar el modelo corporativo con una recreación aproximada, las poses faltantes están registradas y cuentan con fallback visual en CSS, pero deben sustituirse por fuentes oficiales transparentes cuando estén disponibles.

No se deben extraer imágenes de los PDF de referencia ni usar la hoja antigua de expresiones como sprite de producción.
