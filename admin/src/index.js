// eslint-disable-next-line
/*global HM*/
import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import Loading from './Loading';
import registerServiceWorker from './registerServiceWorker';

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

const AsyncNotifications = Loadable( {
	loader: () => import('./Notifications'),
	loading: Loading
} );

const adminBarNotifications = document.querySelector( '#wp-admin-bar-hm-workflows-user-notifications-bar-default' );
adminBarNotifications && ReactDOM.render( <AsyncNotifications adminBar={true} />, adminBarNotifications );

if ( ! adminBarNotifications ) {
	const bodyNotifications = document.querySelector( '#hm-workflows-user-notifications' );
	bodyNotifications && ReactDOM.render( <AsyncNotifications />, bodyNotifications );
}

const AsyncComments = Loadable( {
	loader: () => import('./Comments'),
	loading: Loading
} );

const editorialComments = document.getElementById( 'hm-workflows-comments' );
editorialComments && ReactDOM.render( <AsyncComments postId={ editorialComments.dataset.postId } />, editorialComments );

registerServiceWorker();
