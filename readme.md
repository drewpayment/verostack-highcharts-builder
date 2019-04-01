# Verostack Highcharts Builder 

### Custom implementation to create a spider web chart for http://innovation90.com/innovation-style-report-courageous

There is a small Wordpress bug that needs to be tackled to get this working. Open `~/wp-includes/capabilities.php` and at the top of the file modify so it looks like this: 

```
<?php
include_once(ABSPATH . 'wp-includes/pluggable.php');
```

You can install the `.zip` file directly through the wp-admin dashboard by going to Plugins -> Add New -> Upload and choosing `verostack-highcharts-builder.zip`. After going through the installation process, a new settings option will appear: 

`Custom Highcharts` in the left-side menu of your wp-admin dashboard. 

Click `Custom Highcharts` and enter in the full URL that you would like to place your spider web chart on. 

`http://innovation90.com/innovation-style-report-courageous`

After you've saved this, go to the Wordpress editor for that page and place this snippet of code to activate the plugin where you would like the graph. Keep in mind, the graph is 100% responsive and will take the shape of the `div` you have placed on the page: 

```
<div id="vs-chart"></div>
```

You must also place `id="{PageAttributeID}"` on the coordinating DOM elements according to the "Page Attributes" and "Chart Legend" below... e.g. I want a `div` on my page to use the full name from the query string: 

```
<div class="wp-styled-name-hero-thing" id="vs-chart-hero-name">Fake Name Here</div>
```

The plugin will parse the document, find the id `vs-chart-hero-name` and concatenate the "full name" from the query string and insert it directly as the only input side of the corresponding `div`, replacing the template text of `Fake Name Here` with the values passed in the query string parameters as `f` & `l`. 

Now, you can append the following querystring parameters to your full URL and the graph will be built: 

- `/?f=John&l=Doe&b=67&cr=88&co=99&t=80&d=03-20-2019`

(Full URL example) - 
`http://innovation90.com/innovation-style-report-courageous/?f=John&l=Doe&b=67&cr=88&co=99&t=80&d=03-20-2019`

### Parameters: 

URL Parameters - 

- `f` = First Name
- `l` = Last Name
- `d` = Date - input format (`MM-DD-YYYY`)
- `b` = Bold/Courageous
- `cr` = Creative
- `co` = Collaborative
- `t` = Tactical/Contemplative

Page Attributes - 

- Hero image name `div` ID: `vs-chart-hero-name` - template `${firstName} ${lastName}`
- Hero image date `div` ID: `vs-chart-hero-date` - template `on ${date | date:'MMM-DD, YYYY'}`
- Introductory text line ID: `vs-chart-intro-first-name` - template `Dear ${firstName}:`

Chart Legend - 

- Courageous ID: `vs-chart-legend-courageous` - template `Courageous: ${value}`
- Creative ID: `vs-chart-legend-creative` - template `Creative: ${value}`
- Contemplative (originally tactical) ID: `vs-chart-legend-contemplative` - template `Contemplative: ${value}`
- Collaborative ID: `vs-chart-legend-collaborative` - template `Collaborative: ${value}`

Step 1 Section - 

- Full Name ID: `vs-chart-your-styole-name`

## Troubleshooting

If the activation of the plugin fails, make sure that you edited the `~wp-includes/capabilities.php` exactly as above. This should be the only thing that could break the server and cause the page not to render. 

Otherwise, you are most likely having issues with your syntax or placement of your `div` on the page. 
