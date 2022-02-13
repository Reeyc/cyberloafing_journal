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
            "/Vue/direct",
            "/Vue/class_style",
            "/Vue/instance_prop",
            "/Vue/life_cycle",
            "/Vue/components",
            "/Vue/original_component",
            "/Vue/multiplex",
            "/Vue/animate",
            "/Vue/vue_router",
            "/Vue/vuex"
          ]
        },
        {
          sidebarDepth: 2,
          collapsable: false,
          children: ["/Vue/communication", "/Vue/pack", "/Vue/reactive"]
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
      ]
    }
  }
}
