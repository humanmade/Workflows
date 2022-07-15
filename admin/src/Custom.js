// eslint-disable-next-line
/*global HM*/
import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import Loading from './Loading';

const AsyncNotifications2 = Loadable( {
	loader: () => import('./Notifications/custom'),
	loading: Loading
} );

const adminBarNotifications2 = document.querySelector( '.notification-menu__body' );
adminBarNotifications2 && ReactDOM.render( <AsyncNotifications2 adminBar={false} />, adminBarNotifications2 );
