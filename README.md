# Framing app

I never found a good way of explaining what this app is for. Instead, have a look at this picture.
TODO: include picture of finished result.

Stil don't get it ? Watch [youtube.com](this video)

## Code architecture.

## The coordinate system

Both picture and frame elements have 3 systems of coordinates:

* millimeters `.mm`
* pixels for display `.disp`
* pixels for print `.print`

Out of these 3 systems, there is one reference, the millimeters and the 2 others are just infered from its value.

The need for both millimeters and display pixels is quite obvious. The need for print pixels comes from the requirements of the BytescoutPDF API. They cannot be the same because the mm to disp ratio depends on the zoom level and actual image resolution defined in the settings panel while the mm to print ratio depends on the printing resolution acceptable.

Basically,
* For `.disp`: `dim [px] = dim [mm] * screen scale [px/mm] * zoom [coeff]`
* For `.print`: `dim [px] = dim [mm] * pdf resolution [px/mm]`  
  NB: usually, `pdf resolution = 72 dpi`

### FrameFormat

frameformats
frameFormatID

### Frame

Class Frame:

Array frames
position in frames indicates the stack level: 0 =  bottom, length-1 = top
frameID id of the last frame created.

### Vocable

* sheetSize: A4, A5, etc...
* format: an instance of the FrameFormat
*

