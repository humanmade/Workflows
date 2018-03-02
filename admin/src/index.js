import React from 'react';
import ReactDOM from 'react-dom';
import WorkflowUI from './WorkflowUI';
import registerServiceWorker from './registerServiceWorker';

const uiDiv = document.getElementById('hm-workflow-ui');

uiDiv && ReactDOM.render(<WorkflowUI />, uiDiv);
registerServiceWorker();
