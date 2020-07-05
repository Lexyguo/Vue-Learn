import Vue from 'vue'
import VueRouter from "./fvue-router";
import Home from "../views/Home";
// import About from "../views/About";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/hello',
                name: 'Hello',
                component: () => import(/* webpackChunkName: "about" */ '../components/HelloWorld.vue')
            }
        ]
    },
    {
        path: '/about',
        name: 'About',
        // component: About,
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = new VueRouter({
    routes
});

export default router;
