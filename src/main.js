// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import http from "@/http/index.js";
import { Dialog, Input, Checkbox, Form, FormItem, Loading, Message, Button } from "element-ui";
Vue.use(Dialog);
Vue.use(Input);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$http = http;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    components: { App },
    template: "<App/>"
});
