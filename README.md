# WorkFlows
Powerful workflows for WordPress

Read the [API documentation on the Wiki](https://github.com/humanmade/Workflows/wiki), or learn more in [the Altis DXP documentation](https://www.altis-dxp.com/resources/docs/workflow/).

## Filters

### `hm.workflows.admin_bar_menu.show`

Controls whether the Workflows admin bar notification menu item and its associated controls are rendered for the current user. This filter runs only when a user is logged in and the admin bar is visible on the frontend.

**Parameters:**

- `bool $show` — Whether to show the admin bar menu. Defaults to `true`.
- `WP_User $user` — The currently logged-in user.

**Example — hide the admin bar menu for subscribers:**

```php
add_filter( 'hm.workflows.admin_bar_menu.show', function ( bool $show, WP_User $user ) : bool {
    if ( in_array( 'subscriber', $user->roles, true ) ) {
        return false;
    }
    return $show;
}, 10, 2 );
```
