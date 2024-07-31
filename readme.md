# LUT Parser & Editor Tool by Mikhail Leon

This standalone tool creates, loads, views, modifies and saves **generic** LUT files, with added visual support through a graph & table environment. It supports comments and positive float numbers.

`lut-parser-editor-portable.html`

## Demo Video
https://github.com/user-attachments/assets/45ecfc5c-e811-48aa-b6c1-13aa7fc4178e

*Creation of a LUT representing the RPM-to-horsepower curve of a [Lexus LFA](https://en.wikipedia.org/wiki/Lexus_LFA) (at 100% throttle). Reference image obtained from [Edmunds](https://www.edmunds.com/car-reviews/track-tests/2012-lexus-lfa-dyno-tested.html). Music is 'Girl from Petaluma' by Cocktail Shakers.*

## How does the tool work?

Here is a simplified diagram for how the tool operates. The green, indicating the **data** & internal logic, cannot be directly changed, but the other modules act as both derivatives & interfaces for the data.

![diagram](https://github.com/user-attachments/assets/a04c8d16-b521-46f1-af82-366ff9683058)


The **points** and the **curves** of the **graph** are created in 2 separate steps. The **points** are interactive `div` elements (click, drag) and will modify the **data** (and thus, also the **table**). The **curves** are dynamically drawn pixel-by-pixel in a `canvas` element that mathematically determines the curves' position based on given parameters (interpolation mode, coordinates of adjacent points).

The **table** is a more straightforward way to create, modify & delete **data** via text interface.

The **parsing** functionality is completely bespoke & interprets the **.LUT file** as an **8-bit buffer**. Comments begin with a `;` and end with a `\n`. Global comments (comments not attached to any point) are sorted to the top. Key-value pairs are numbers (decimal points can be included) separated by a `|` and are sorted in ascending **x** (key) value.

## What is a LUT?

A LUT is a generic [lookup table](https://en.wikipedia.org/wiki/Lookup_table) file. It is a simple method of storing a relationship between one value and another (in this case, **x** and **y**), not dissimilar to an array or hashmap.

**x --> y** or F(**x**) = **y**

There is no standardized spec for how a LUT file looks. The custom-built parser within the tool will read files structured similarly to this:
```
;This is a global comment
0  |  50  ;This is a comment on the specific Point (0,50). For x = 0, y = 50. F(0)=50.
5  |  80.5
10  |  60
20  |  50
```
The tool will then populate the sorted data as defined in the file, while also maintaining persistence of comment lines.
Due to the use case, the **parser** & **writer** will assume only positive values for both **x** and **y**.

## What is a LUT used for?

It is used for any process that wants to easily store & quickly access a 2D mathematical relationship **x --> y**. Think of a graph - you have the **x** points, but you want to find the **y** points for any given **x**. The relationship is defined by placement of known data points; as such, its nature can be arbitrary and not bound by a single mathematical formula, such as a [polynomial](https://en.wikipedia.org/wiki/Polynomial) or [trigonometric](https://en.wikipedia.org/wiki/Trigonometric_functions) expression.

This method can be useful for storing *any* 2D graph, such as a car engine's torque curve - usually obtained in real-life by recording [dyno](https://en.wikipedia.org/wiki/Dynamometer) data. Such data can then be used to help create accurate simulations of an engine in a driving simulator, or to represent *any* other known physical relationship in vehicle dynamics. The relationships can even be chained to get multidimensional (3D or higher) information.

![If You Understand Volumetric Efficiency You Understand Engines 6-31 screenshot](https://github.com/user-attachments/assets/5926cd52-32cc-495a-bd9b-812e7d6adbf3)

Another popular example is color LUTs that [color-grade](https://en.wikipedia.org/wiki/Color_grading) photo or video footage as part of the creative process of editing by defining specific relationships between initial pixel color values and desired output.

![lut-example](https://github.com/user-attachments/assets/9f06ba11-9a68-4301-8a2a-313659b2fe80)

The prevalence of LUTs and their utility is immense.

The tool can load in reference images, either from a local path on the user's device, or from a URL, but the host of the image must allow 'anonymous' fetching (for example, images hosted on Twitter currently allow this, but not all hosts will). There are a few controls to help align references correctly, but it's preferable this be done externally ahead of time.

The tool was originally designed to be compatible with [Assetto Corsa](https://en.wikipedia.org/wiki/Assetto_Corsa)'s LUT files.

## What happens to the values inbetween that were not defined?

That depends on the software that is interpreting the data. Generally, some interpolation will be performed by using known adjacent values. The tool offers 3 of the most common modes for visualizing such interpolation:

![interpolation-visualized](https://github.com/user-attachments/assets/039ef647-9107-4a08-8d14-0ae29ee881d8)
*Note: the '**Cubic**' interpolation here is more specifically a [Catmull-Rom Spline (Centripetal)](https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline), which guarantees a curve to smoothly move through all points, unlike a standard [Bézier Curve](https://en.wikipedia.org/wiki/B%C3%A9zier_curve).*


Finally, the tool can save your data. The **writer** performs a process in reverse to the **parser** by creating an **8-bit buffer** and saving it as a compatible **.LUT file**. The repository contains `example-lfa-horsepower.lut` with the same data that was created during the Demo Video, which can easily be loaded in again.
