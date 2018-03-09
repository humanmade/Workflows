import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import Loading from './Loading';
import Notifications from './Notifications';
import registerServiceWorker from './registerServiceWorker';
import { injectGlobal } from 'styled-components';

/**
 * Async loading Workflow UI.
 */
const uiDiv = document.getElementById('hm-workflow-ui');
const postId = document.getElementById('post_ID');

const AsyncWorkflowUI = Loadable( {
	loader: () => import('./WorkflowUI'),
	loading: Loading
} );

if ( uiDiv ) {
	ReactDOM.render( <AsyncWorkflowUI postId={postId ? postId.value : null}/>, uiDiv );
}

/**
 * Always load notifications.
 */
injectGlobal`
	#wpadminbar #wp-admin-bar-hm-workflows-user-notifications-bar {
		.ab-sub-wrapper {
			right: 0;
			min-width: 400px;
		}
	}
`;

const adminBarNotifications = document.querySelector( '#wp-admin-bar-hm-workflows-user-notifications-bar-default' );
adminBarNotifications && ReactDOM.render( <Notifications adminBar={true} />, adminBarNotifications );

if ( ! adminBarNotifications ) {
	const bodyNotifications = document.querySelector( '#hm-workflows-user-notifications' );
	bodyNotifications && ReactDOM.render( <Notifications />, bodyNotifications );
}

registerServiceWorker();
