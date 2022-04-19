module.exports = {
  // base: "/cyberloafing_journal/",
  title: "Cyberloafing Journal",
  description: "网络闲散日志",
  head: [
    [
      "link",
      {
        rel: "shortcut icon",
        type: "image/x-icon",
        href: "/assets/img/logo.png"
      }
    ]
  ],
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  plugins: [
    ["@vuepress/nprogress"],
    ["@vuepress/back-to-top"],
    ["reading-progress"],
    [
      "@vssue/vuepress-plugin-vssue",
      {
        platform: "github", //v3的platform是github，v4的是github-v4
        locale: "zh", //语言
        owner: "Reeyc", //github账户名
        repo: "cyberloafing_journal", //github一个项目的名称
        clientId: "065e72b5ff237807bdc0", //注册的Client ID
        clientSecret: "62b07d3fc7997d0a42fdaddd93c7fa58fb8b7220", //注册的Client Secret
        autoCreateIssue: true // 自动创建评论，默认是false，最好开启，这样首次进入页面的时候就不用去点击创建评论的按钮了。
      }
    ]
  ],
  themeConfig: {
    logo: "/assets/img/logo.png",
    nav: [
      { text: "Javascript", link: "/js/" },
      { text: "ES6", link: "/es6/" },
      { text: "Vue", link: "/vue/" },
      { text: "React", link: "/react/" },
      { text: "Typescript", link: "/ts/" }
      // { text: "面经", link: "/Interview/" },
      // { text: "Github", link: "https://github.com/Reeyc/cyberloafing_journal" }
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
            "/vue/vue3/internal",
            "/vue/vue3/pinia"
          ]
        }
      ],
      "/react/": [
        {
          title: "React",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/react/jsx",
            "/react/component",
            "/react/state",
            "/react/controlled",
            "/react/props",
            "/react/life_cycle",
            "/react/render_props",
            "/react/hoc",
            "/react/animate",
            "/react/router",
            "/react/redux",
            "/react/hooks"
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
