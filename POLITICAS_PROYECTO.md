================================================================================
POLÍTICAS DEL PROYECTO – REGLAS PARA USO DE IA Y DESARROLLO
===========================================================

REGLAS OBLIGATORIAS PARA CUALQUIER MODIFICACIÓN DEL CÓDIGO O GENERACIÓN DE CONTENIDO

================================================================================

1. PRINCIPIO FUNDAMENTAL
   ================================================================================

Si algo ya funciona correctamente:
NO modificarlo.

Si el cambio no fue solicitado explícitamente:
NO realizarlo.

Si existe riesgo de romper funcionalidad:
DETENERSE y consultar primero.

================================================================================
2. POLÍTICA DE COMUNICACIÓN CON LA IA
=====================================

Todas las respuestas, explicaciones y confirmaciones deben realizarse
EXCLUSIVAMENTE en ESPAÑOL.

Reglas obligatorias:

1. No responder en inglés.
2. No mezclar español con inglés salvo términos técnicos necesarios.
3. Toda explicación técnica debe estar en español.
4. Si una respuesta aparece en inglés, debe corregirse antes de continuar.

Objetivo:
Mantener coherencia en la comunicación técnica del proyecto.

================================================================================
3. POLÍTICA DE ESTÁNDAR DE CÓDIGO
=================================

Las siguientes reglas aplican a TODO el código generado o modificado
(HTML, CSS, JavaScript u otros lenguajes).

REGLAS OBLIGATORIAS:

1. TODO el código debe incluir comentarios explicativos en español.
2. Cada función debe tener una explicación clara de lo que hace.
3. Las partes críticas del código deben estar documentadas.
4. No omitir comentarios por considerarlos obvios.

Ejemplo:

```javascript
// Carga la lista de proyectos desde el archivo JSON del portafolio
function loadProjects() {

}
```

Objetivo:
Facilitar mantenimiento, aprendizaje y futuras modificaciones.

================================================================================
4. POLÍTICA DE NOMENCLATURA DE CÓDIGO
=====================================

Las variables, funciones, clases y estructuras de datos deben INGLÉS siguiendo convenciones estándar de
estar escritas en programación.

Reglas obligatorias:

1. Variables en inglés.
2. Funciones en inglés.
3. Clases en inglés.
4. Constantes en inglés.

Ejemplo correcto:

```
let projectList
let userProfile
function loadProjects()
```

Ejemplo incorrecto:

```
let listaProyectos
let perfilUsuario
function cargarProyectos()
```

Motivo:
Mantener compatibilidad con estándares internacionales de desarrollo.

================================================================================
5. POLÍTICA DE PROPUESTA DE CAMBIOS
===================================

Antes de realizar CUALQUIER cambio, modificación o generación de código,
DEBE preguntarse explícitamente al desarrollador.

Debe indicarse:

CAMBIO PROPUESTO:

Archivo:
Sección:
Cambio exacto:
Qué se mantiene intacto:
Impacto estimado:
Riesgo potencial:

Luego preguntar:

¿Confirmas para continuar? (SÍ / NO)

Si no existe confirmación explícita, NO continuar.

================================================================================
6. POLÍTICA DE MODIFICACIÓN DE ARCHIVOS
=======================================

Queda PROHIBIDO sobrescribir archivos completos sin autorización.

Reglas:

1. No sobrescribir archivos completos.
2. No eliminar estructura existente.
3. No duplicar código.
4. No modificar secciones no solicitadas.
5. Solo editar la sección específica indicada.

Si el cambio requiere modificaciones estructurales:

1. Explicar primero el cambio.
2. Esperar confirmación.
3. Aplicar cambios de forma controlada.

Objetivo:
Evitar pérdida de código o ruptura de funcionalidades.

================================================================================
7. POLÍTICA DE CALIDAD DEL CÓDIGO
=================================

No se permite:

* scripts duplicados
* funciones duplicadas
* lógica repetida
* reglas CSS duplicadas
* variables sin uso
* código muerto

Si se detecta:

Código duplicado → optimizar o consolidar
Código sin uso → eliminar
Procesos redundantes → simplificar

Antes de finalizar una modificación se debe verificar:

* que no haya duplicaciones
* que no exista código muerto
* que la funcionalidad original se mantenga intacta

================================================================================
8. POLÍTICA DE ESTADO OPERATIVO DE LA IA
========================================

Antes de ejecutar cambios relevantes la IA debe indicar su estado operativo.

Opciones válidas:

• Operativa correctamente
• Presenta limitaciones
• Presenta fallas

Si existen anomalías (errores repetidos, pérdida de contexto, duplicación
de código, problemas al editar archivos) debe informarse inmediatamente.

Objetivo:
Evitar ejecuciones inestables.

================================================================================
9. POLÍTICA DE CONFIRMACIÓN DE FINALIZACIÓN
===========================================

Al terminar cualquier tarea se debe indicar explícitamente:

• "Tarea finalizada correctamente."
• "Cambios aplicados y proceso completado."

Además se debe:

1. Resumir brevemente los cambios.
2. Confirmar que otras partes del proyecto NO fueron alteradas.
3. Indicar si se recomienda validación manual.

================================================================================
10. REGLA FINAL
===============

Si algo ya funcionaba:
NO lo rompas.

Si no fue solicitado:
NO lo implementes.

Si no estás seguro:
PREGUNTA primero.

# La estabilidad del proyecto tiene prioridad sobre cualquier mejora.

================================================================================
11. POLÍTICA DE API EMAILJS - NO MODIFICAR
===========================================

La configuración de EmailJS en el formulario de contacto está VERIFICADA y
FUNCIONANDO correctamente.

Queda PROHIBIDO modificar:

* publicKey
* serviceId
* templateId
* Cualquier parte de la función setupContactForm()

Excepciones:
Solo se permitirá修改 con autorización explícita del administrador.

Si necesita hacer cambios:
1. Consultar primero
2. Obtener autorización
3. Documentar el cambio

Esta política aplica a TODO el código relacionado con el envío de emails.


