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
      { text: "ES6+", link: "/ES6/" },
      { text: "Vue", link: "/Vue/" },
      { text: "Typescript", link: "/Typescript/" },
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
          title: "Vue",
          sidebarDepth: 2,
          collapsable: false,
          children: [
            "/Vue/direct.md",
            "/Vue/class_style.md",
            "/Vue/instance_prop.md",
            "/Vue/life_cycle.md",
            "/Vue/components.md",
            "/Vue/original_component.md",
            "/Vue/animate.md",
            "/Vue/vue_router.md",
            "/Vue/vuex.md"
          ]
        },
        {
          sidebarDepth: 2,
          collapsable: false,
          children: ["/Vue/communication.md", "/Vue/pack.md", "/Vue/reactive.md"]
        }
      ]
    }
  }
}
