import React from 'react';
import ReactDOM from 'react-dom';
import WorkflowUI from './WorkflowUI';
import registerServiceWorker from './registerServiceWorker';

const uiDiv = document.getElementById('hm-workflow-ui');
const postId = document.getElementById('post_ID');

uiDiv && ReactDOM.render(<WorkflowUI
	postId={postId ? postId.value : null}
/>, uiDiv);
registerServiceWorker();
