Changelog
=========

v0.3.11
- Bug: Fix warnings for missing `permission_callback`s on REST routes

v0.3.10
- Bug: Allow site admins access to workflows UI

v0.3.9
- Bug: Fix crash with "specific users" recipient #112

v0.3.8
- Bug: add `remove` method for Events #107

v0.3.7
- Bug: add `remove` method for Destinations #100

v0.3.6

- Bug: Fix regex for PHP7.3 pcre2 compat #86
- Enhancement: Add SRI support for JS chunks #91

v0.3.5

- Bug: Fix character encoding in titles, should send raw data to destination endpoints

v0.3.4

- Bug: Fix incorrect escaping for dashboard notifications #81
- Bug: Fix missing `use` statement in editorial comments controller
- Bug: Fix post type capability warning on post list table
- Bug: Fix dashboard notification request timer

v0.3.3

- Bug: Fix recipient data types #77
- Bug: Add missing text domains for translation #78

v0.3.2

- Bug: Fix z-index issue with dropdowns on editor screen
- Enhancement: Add post author recipient handler to new editorial comment event
- Bug: Fall back to post meta assignees if none set with comment
- Bug: Fix non super admin capabalities on multisite
- Bug: Fix escaping of quotes in dashboard notifications
- Bug: Fix rest_api_init action warning

v0.3.1

- Bug: Fix the editorial comments assignees endpoints.
- UI: Remove slug div from workflows edit screen

v0.3.0

- Enhancement: Register an event for handling new comments, and a recipient handler for the author of the corresponding post.
- Bug: Don't show an "Assigned to me" link on the post listing screen when nothing is assigned to me.
- Other minor fixes.

v0.2.3

- Submitted to packagist.org
- Bug: Show comments UI for drafts too
- Enhancement: Use `add_post_type_support( $type, 'editorial-comments' )` to enable feature
- Bug: Fix cap check for some roles not being able to comment

v0.2.2

- Bug: Fix meta field auth callback to allow saving posts through the REST API.

v0.2.1

- Bug: Stop workflow comments showing anywhere other than REST API endpoint

v0.2.0

- Enhancement: Added editorial comments on top of post assignees
- Enhancement: Add post list table filter for assigned posts
- Bug: Fix webhook authentication check
- Bug: Add cache busting to notifications API lookups

v0.1.10

- Enhancement: Move the Workflows menu item down with other tools/plugins
- Enhancement: Neater UI and styling for the admin bar notifications.
- Bug: Fix dev server for modified webpack entry value
- Bug: Fix exiting create new screen before save creating an empty draft post

v0.1.9

- Fix SC_ATTR env output, namespace webpack jsonpFunction

v0.1.8

- Enhancement: Use dynamic public path webpack plugin

v0.1.7

- Further compat with Yoast, can't use multiple instances of styled-components

v0.1.6

- Compat with Yoast SEO, upgrade styled-components

v0.1.5

- Bug: Fix service worker asset path
- Enhancement: Protect against race conditions in user meta API

v0.1.4

- Bug: Main UI was showing on all post edit screens

v0.1.3

- Bug: notifications not showing in admin bar on front end

v0.1.2

- Major bug fix, built files were not being loaded at all

v0.1.1

- Added localisation support
- Added transition post status event

v0.1.0

- Initial version
