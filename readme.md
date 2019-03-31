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

Now, you can append the following querystring parameters to your full URL and the graph will be built: 

`http://innovation90.com/innovation-style-report-courageous/?f=John&l=Doe&b=25&cr=28&co=31&t=19`

### Parameters: 
- `f` = First Name
- `l` = Last Name
- `b` = Bold/Courageous
- `cr` = Creative
- `co` = Collaborative
- `t` = Tactical

## Troubleshooting

If the activation of the plugin fails, make sure that you edited the `~wp-includes/capabilities.php` exactly as above. This should be the only thing that could break the server and cause the page not to render. 

Otherwise, you are most likely having issues with your syntax or placement of your `div` on the page. 