/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultInjection
 */

'use strict';

var BeforeInputEventPlugin = require('BeforeInputEventPlugin');
var ChangeEventPlugin = require('ChangeEventPlugin');
var DefaultEventPluginOrder = require('DefaultEventPluginOrder');
var EnterLeaveEventPlugin = require('EnterLeaveEventPlugin');
var ExecutionEnvironment = require('ExecutionEnvironment');
var HTMLDOMPropertyConfig = require('HTMLDOMPropertyConfig');
var ReactBrowserComponentMixin = require('ReactBrowserComponentMixin');
var ReactComponentBrowserEnvironment =
  require('ReactComponentBrowserEnvironment');
var ReactDOMComponent = require('ReactDOMComponent');
var ReactDOMComponentTree = require('ReactDOMComponentTree');
var ReactDOMTreeTraversal = require('ReactDOMTreeTraversal');
var ReactDOMTextComponent = require('ReactDOMTextComponent');
var ReactDefaultBatchingStrategy = require('ReactDefaultBatchingStrategy');
var ReactEventListener = require('ReactEventListener');
var ReactInjection = require('ReactInjection');
var ReactReconcileTransaction = require('ReactReconcileTransaction');
var SVGDOMPropertyConfig = require('SVGDOMPropertyConfig');
var SelectEventPlugin = require('SelectEventPlugin');
var SimpleEventPlugin = require('SimpleEventPlugin');

var alreadyInjected = false;

function inject() {
  if (alreadyInjected) {
    // TODO: This is currently true because these injections are shared between
    // the client and the server package. They should be built independently
    // and not share any injection state. Then this problem will be solved.
    return;
  }
  alreadyInjected = true;

  ReactInjection.EventEmitter.injectReactEventListener(
    ReactEventListener
  );

  /**
   * Inject modules for resolving DOM hierarchy and plugin ordering.
   */
  ReactInjection.EventPluginHub.injectEventPluginOrder(DefaultEventPluginOrder);
  ReactInjection.EventPluginUtils.injectComponentTree(ReactDOMComponentTree);
  ReactInjection.EventPluginUtils.injectTreeTraversal(ReactDOMTreeTraversal);

  /**
   * Some important event plugins included by default (without having to require
   * them).
   */
  ReactInjection.EventPluginHub.injectEventPluginsByName({
    SimpleEventPlugin: SimpleEventPlugin,
    EnterLeaveEventPlugin: EnterLeaveEventPlugin,
    ChangeEventPlugin: ChangeEventPlugin,
    SelectEventPlugin: SelectEventPlugin,
    BeforeInputEventPlugin: BeforeInputEventPlugin,
  });

  ReactInjection.NativeComponent.injectGenericComponentClass(
    ReactDOMComponent
  );

  ReactInjection.NativeComponent.injectTextComponentClass(
    ReactDOMTextComponent
  );

  ReactInjection.Class.injectMixin(ReactBrowserComponentMixin);

  ReactInjection.DOMProperty.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
  ReactInjection.DOMProperty.injectDOMPropertyConfig(SVGDOMPropertyConfig);

  ReactInjection.EmptyComponent.injectEmptyComponent('noscript');

  ReactInjection.Updates.injectReconcileTransaction(
    ReactReconcileTransaction
  );
  ReactInjection.Updates.injectBatchingStrategy(
    ReactDefaultBatchingStrategy
  );

  ReactInjection.Component.injectEnvironment(ReactComponentBrowserEnvironment);

  if (__DEV__) {
    var url = (ExecutionEnvironment.canUseDOM && window.location.href) || '';
    if ((/[?&]react_perf\b/).test(url)) {
      var ReactDefaultPerf = require('ReactDefaultPerf');
      ReactDefaultPerf.start();
    }
  }
}

module.exports = {
  inject: inject,
};
