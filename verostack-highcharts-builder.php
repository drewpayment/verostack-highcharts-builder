<?php
/*
Plugin Name: Verostack Custom Highcharts Plugin
Description: Custom Highcharts Graph Builder
Author: Drew Payment
Date: 03/26/2019
License: 
The MIT License

Copyright (c) 2016-2019 Verostack Development, LLC https://verostack.io

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

defined( 'ABSPATH' ) or die( 'Unauthorized script loading. Please reload.' );

if(!class_exists(vs_highcharts_builder)) {
    class vs_highcharts_builder {

        protected $page_title = 'Verostack\'s Custom Highcharts Plugin Settings';
        protected $menu_title = 'Custom Highcharts';
        protected $capability = 'manage_options';
        protected $menu_slug = 'vs_custom_hc_options';
    
        function __construct() {
            add_menu_page($this->page_title, $this->menu_title, $this->capability, $this->menu_slug, array($this, 'settings_page'), 'dashicons-admin-links', 98);

            if(!isset($_POST) || count($_POST) < 1) {

                $json_option = get_option('vs_custom_hc_urls');

                if(isset($json_option) && !is_null($json_option)) {
                    setcookie('hc_urls', $json_option);
                }

            }

            add_action('wp_enqueue_scripts', 'highcharts_builder_init');
        }
    
        function settings_page() {
            if (!current_user_can('manage_options')) {
                wp_die('Unauthorized user');
            }
    
            $urls = [];
    
            foreach($_POST as $k => $v) {
                if(!isset($v)) continue;
                $urls[] = $v;
            }

            if(count($urls) > 0) {
                $json = json_encode($urls);
                update_option('vs_custom_hc_urls', $json);
            }
    
            include plugin_dir_path(__FILE__) . 'settings-form.php';
        }
    
    }
}

function highcharts_builder_init()
{
    wp_enqueue_script('vs-main', plugins_url('dist/main.js', __FILE__), array(), rand(1, 100), true);
}

new vs_highcharts_builder;
