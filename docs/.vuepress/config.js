module.exports = {
  // base: "/cyberloafing_journal/",
  title: "Cyberloafing Journal",
  description: "网络闲散日志",
  head: [["link", { rel: "shortcut icon", type: "image/x-icon", href: "/assets/img/logo.png" }]],
  markdown: {
    lineNumbers: false // 代码块显示行号
  },
  plugins: ["@vuepress/nprogress", "@vuepress/back-to-top", "reading-progress"],
  themeConfig: {
    logo: "/assets/img/logo.png",
    nav: [
      { text: "Javascript", link: "/js/" },
      { text: "ES6", link: "/es6/" },
      { text: "Vue", link: "/vue/" },
      { text: "Typescript", link: "/ts/" },
      { text: "面经", link: "/Interview/" },
      { text: "Github", link: "https://github.com/Reeyc/cyberloafing_journal" }
    ],
    sidebar: {
      "/js/": [
        {
          title: "Javascript基础",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/js/base_data_type",
            "/js/operator",
            "/js/process_control",
            "/js/object",
            "/js/function",
            "/js/array",
            "/js/dom",
            "/js/event",
            "/js/bom",
            "/js/ajax",
            "/js/localstore"
          ]
        },
        {
          title: "Javascript进阶",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/js/prototype",
            "/js/class",
            "/js/inherit",
            "/js/execution_context",
            "/js/event_loop",
            "/js/memory_reclamation",
            "/js/render"
          ]
        }
      ],
      "/es6/": [
        {
          title: "ECMAScript 6.0",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/es6/declaration",
            "/es6/deconstruction",
            "/es6/extend",
            "/es6/stringExtend",
            "/es6/arrayExtend",
            "/es6/functionExtend",
            "/es6/objectExtend",
            "/es6/regExpExtend",
            "/es6/symbol",
            "/es6/setMap",
            "/es6/iterator",
            "/es6/promise",
            "/es6/generator",
            "/es6/async",
            "/es6/class",
            "/es6/module"
          ]
        }
      ],
      "/vue/": [
        {
          title: "Vue2",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/vue/vue2/direct",
            "/vue/vue2/class_style",
            "/vue/vue2/instance_prop",
            "/vue/vue2/life_cycle",
            "/vue/vue2/components",
            "/vue/vue2/original_component",
            "/vue/vue2/multiplex",
            "/vue/vue2/animate",
            "/vue/vue2/vue_router",
            "/vue/vue2/vuex",
            "/vue/vue2/communication",
            "/vue/vue2/pack",
            "/vue/vue2/reactive"
          ]
        },
        {
          title: "Vue3",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/vue/vue3/personality",
            "/vue/vue3/life_cycle",
            "/vue/vue3/reactive",
            "/vue/vue3/ref",
            "/vue/vue3/other",
            "/vue/vue3/listen",
            "/vue/vue3/hook",
            "/vue/vue3/internal"
          ]
        }
      ],
      "/ts/": [
        {
          title: "Typescript",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/ts/base",
            "/ts/tuple",
            "/ts/enum",
            "/ts/function",
            "/ts/advanced",
            "/ts/assertion",
            "/ts/class",
            "/ts/interface",
            "/ts/generic",
            "/ts/operator",
            "/ts/decorator"
          ]
        }
      ],
      "/Interview/": [
        {
          title: "面试题",
          sidebarDepth: 2,
          collapsable: false,
          children: ["/Interview/css", "/Interview/js", "/Interview/vue", "/Interview/broswer"]
        }
      ]
    }
  }
}
