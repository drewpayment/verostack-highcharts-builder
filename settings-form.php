<?php 
defined( 'ABSPATH' ) or die( 'Unauthorized script loading. Please reload.' );

$urls = get_option('vs_custom_hc_urls');
if($urls != false)
    $urls = json_decode($urls, true);
$urls_count = 10;

?>

<style>
    .vs-form-field {
        margin: 0.25rem;
    }

    .vs-input {
        width: 680px;
    }
</style>

<h2>Verostack Custom Highcharts Builder Page</h2>

<h4>URLs to check parameters for when the page loads:</h4>

<form id="vs_custom_form" method="POST">
    <?php for($i = 0; $i < $urls_count; $i++) { ?>
    <div class="vs-form-field">
        <label for="vs_custom_hc_url_<?php echo $i ?>">URL:</label>
        <?php if(isset($urls[$i])) { ?>
        <input type="text" class="vs-input" name="vc_custom_hc_url_<?php echo $i ?>" id="vc_custom_hc_url_<?php echo $i ?>" value="<?php echo $urls[$i]; ?>" />
        <?php } else { ?>
        <input type="text" class="vs-input" name="vc_custom_hc_url_<?php echo $i ?>" id="vc_custom_hc_url_<?php echo $i ?>" placeholder="http://url-to-check.com" />
        <?php } ?>
    </div>
    <br />
    <?php } ?>

    <input type="submit" value="Save" class="button button-primary button-large" />
</form>