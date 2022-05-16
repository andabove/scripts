# RCCO Scripts

## Introduction

We have created our own implementation of the weglot translation module to allow for custom language selectors. To make it easier for integrations below is a how to guide as well as displaying some of the other options available.

## Integration

This is the basic integration code

```html
<!-- Start of weglot code -->
<script
  type="text/javascript"
  src="https://cdn.weglot.com/weglot.min.js"
></script>
```

The RCCO implementation, make sure to check on the right that the version numbers match for latest. If you are not sure, check with a developer.

```html
<!-- Start of RCCO Weglot Code -->
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/gh/rcco/scripts@0.1.0/webflow/language_switcher.min.js"
></script>
```

The initialisation code from weglot

```html
<script>
  Weglot.initialize({
    api_key: "API_KEY_HERE",
    hide_switcher: true,
    cache: true,
  });
</script>

<!-- End of integration -->
```

If you need to change some of the settings (such as enabling hubspot insights search and replace) then you will need to include this piece of code above the RCCO implementation. To see the other options available, check in the code

```html
<script type="text/javascript">
  window.weglotCustomOptions = {
    INSIGHTS: {
      enabled: true,
      domain: "HUBSPOT_DOMAIN_HERE",
      prefix: "insights",
    },
  };
</script>
```

## Config
