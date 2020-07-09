import Vue from 'vue'
import VueRouter from "./fvue-router";
import Home from "../views/Home";
// import About from "../views/About";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        // component: About,
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
        children: [
            {
                path: '/about/hello',
                name: 'Hello',
                component: () => import('../components/HelloWorld.vue')
            }
        ]
    }
]

const router = new VueRouter({
    routes
});

export default router;
