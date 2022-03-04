module.exports = {
  // base: "/cyberloafing_journal/",
  title: "Cyberloafing Journal",
  description: "Cyberloafing Journal",
  head: [["link", { rel: "shortcut icon", type: "image/x-icon", href: "/assets/img/logo.png" }]],
  markdown: {
    lineNumbers: false // 代码块显示行号
  },
  plugins: ["@vuepress/nprogress", "@vuepress/back-to-top", "reading-progress"],
  themeConfig: {
    logo: "/assets/img/logo.png",
    nav: [
      { text: "Javascript", link: "/Javascript/" },
      { text: "ES6", link: "/ES6/" },
      { text: "Vue", link: "/Vue/" },
      { text: "Typescript", link: "/Typescript/" },
      { text: "面经", link: "/Interview/" },
      { text: "Github", link: "https://github.com/Reeyc/cyberloafing_journal" }
    ],
    sidebar: {
      "/Javascript/": [
        {
          title: "Javascript基础",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/Javascript/base_data_type",
            "/Javascript/operator",
            "/Javascript/process_control",
            "/Javascript/object",
            "/Javascript/function",
            "/Javascript/array",
            "/Javascript/dom",
            "/Javascript/event",
            "/Javascript/bom",
            "/Javascript/ajax",
            "/Javascript/localstore"
          ]
        },
        {
          title: "Javascript进阶",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/Javascript/prototype",
            "/Javascript/class",
            "/Javascript/inherit",
            "/Javascript/execution_context",
            "/Javascript/event_loop",
            "/Javascript/memory_reclamation",
            "/Javascript/render"
          ]
        }
      ],
      "/ES6/": [
        {
          title: "ECMAScript 6.0",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/ES6/declaration",
            "/ES6/deconstruction",
            "/ES6/extend",
            "/ES6/stringExtend",
            "/ES6/arrayExtend",
            "/ES6/functionExtend",
            "/ES6/objectExtend",
            "/ES6/regExpExtend",
            "/ES6/symbol",
            "/ES6/setMap",
            "/ES6/iterator",
            "/ES6/promise",
            "/ES6/generator",
            "/ES6/async",
            "/ES6/class",
            "/ES6/module"
          ]
        }
      ],
      "/Vue/": [
        {
          title: "Vue2",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/Vue/vue2/direct",
            "/Vue/vue2/class_style",
            "/Vue/vue2/instance_prop",
            "/Vue/vue2/life_cycle",
            "/Vue/vue2/components",
            "/Vue/vue2/original_component",
            "/Vue/vue2/multiplex",
            "/Vue/vue2/animate",
            "/Vue/vue2/vue_router",
            "/Vue/vue2/vuex",
            "/Vue/vue2/communication",
            "/Vue/vue2/pack",
            "/Vue/vue2/reactive"
          ]
        },
        {
          title: "Vue3",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/Vue/vue3/personality",
            "/Vue/vue3/life_cycle",
            "/Vue/vue3/reactive",
            "/Vue/vue3/ref",
            "/Vue/vue3/other",
            "/Vue/vue3/listen",
            "/Vue/vue3/hook",
            "/Vue/vue3/internal"
          ]
        }
      ],
      "/TypeScript/": [
        {
          title: "TypeScript",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/TypeScript/base",
            "/TypeScript/tuple",
            "/TypeScript/enum",
            "/TypeScript/function",
            "/TypeScript/advanced",
            "/TypeScript/assertion",
            "/TypeScript/class",
            "/TypeScript/interface",
            "/TypeScript/generic",
            "/TypeScript/operator",
            "/TypeScript/decorator"
          ]
        }
      ],
      "/Interview/": [
        {
          title: "面试题",
          sidebarDepth: 2,
          collapsable: false,
          children: ["/Interview/vue"]
        }
      ]
    }
  }
}
