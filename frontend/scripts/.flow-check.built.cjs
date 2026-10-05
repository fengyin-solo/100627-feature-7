"use strict";

// src/data/modules.ts
var MODULES = [
  {
    key: "station",
    name: "\u7535\u7AD9\u53F0\u8D26",
    entity: "\u6C34\u7535\u7AD9",
    desc: "\u7EF4\u62A4\u6C34\u7535\u7AD9\uFF0C\u56F4\u7ED5\u7535\u7AD9\u7F16\u53F7\u3001\u7535\u7AD9\u540D\u79F0\u3001\u88C5\u673A\u5BB9\u91CF\u3001\u673A\u7EC4\u53F0\u6570\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u7535\u7AD9\u7F16\u53F7", "\u7535\u7AD9\u540D\u79F0", "\u88C5\u673A\u5BB9\u91CF", "\u673A\u7EC4\u53F0\u6570", "\u8BBE\u8BA1\u6C34\u5934", "\u6295\u8FD0\u65E5\u671F", "\u6240\u5C5E\u6D41\u57DF", "\u8FD0\u884C\u72B6\u6001"],
    statuses: ["\u5728\u5EFA", "\u8BD5\u8FD0\u884C", "\u6B63\u5E38\u8FD0\u884C", "\u505C\u673A\u68C0\u4FEE"],
    actions: ["\u6295\u5165\u8BD5\u8FD0\u884C", "\u786E\u8BA4\u6295\u4EA7", "\u7533\u8BF7\u505C\u673A"],
    actionTargets: { "\u6295\u5165\u8BD5\u8FD0\u884C": "\u8BD5\u8FD0\u884C", "\u786E\u8BA4\u6295\u4EA7": "\u6B63\u5E38\u8FD0\u884C", "\u7533\u8BF7\u505C\u673A": "\u505C\u673A\u68C0\u4FEE" },
    metrics: ["\u603B\u88C5\u673A\u5BB9\u91CF", "\u6B63\u5E38\u8FD0\u884C\u7535\u7AD9", "\u68C0\u4FEE\u4E2D\u7535\u7AD9"]
  },
  {
    key: "unit",
    name: "\u673A\u7EC4\u8FD0\u884C",
    entity: "\u6C34\u8F6E\u53D1\u7535\u673A\u7EC4",
    desc: "\u7EF4\u62A4\u6C34\u8F6E\u53D1\u7535\u673A\u7EC4\uFF0C\u56F4\u7ED5\u673A\u7EC4\u7F16\u53F7\u3001\u673A\u7EC4\u578B\u53F7\u3001\u989D\u5B9A\u8F6C\u901F\u3001\u6709\u529F\u51FA\u529B\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u63A8\u8FDB\u3002",
    // 「运行状态」字段已移除：页面与各业务口径统一只认 status，不再存在两套状态。
    fields: ["\u673A\u7EC4\u7F16\u53F7", "\u673A\u7EC4\u578B\u53F7", "\u989D\u5B9A\u8F6C\u901F", "\u6709\u529F\u51FA\u529B", "\u65E0\u529F\u51FA\u529B", "\u7D2F\u8BA1\u8FD0\u884C\u5C0F\u65F6", "\u632F\u52A8\u6570\u503C"],
    // 状态链：待启动→运行中→停机备用→（回到）待启动；故障支路：运行中→故障停机→（检修闭环）→停机备用。
    statuses: ["\u5F85\u542F\u52A8", "\u8FD0\u884C\u4E2D", "\u505C\u673A\u5907\u7528", "\u6545\u969C\u505C\u673A"],
    actions: ["\u5F00\u673A\u5E76\u7F51", "\u505C\u673A\u8F6C\u5907", "\u767B\u8BB0\u6545\u969C", "\u6062\u590D\u5F85\u542F\u52A8"],
    actionTargets: { "\u5F00\u673A\u5E76\u7F51": "\u8FD0\u884C\u4E2D", "\u505C\u673A\u8F6C\u5907": "\u505C\u673A\u5907\u7528", "\u767B\u8BB0\u6545\u969C": "\u6545\u969C\u505C\u673A", "\u6062\u590D\u5F85\u542F\u52A8": "\u5F85\u542F\u52A8" },
    metrics: ["\u8FD0\u884C\u4E2D\u673A\u7EC4", "\u53EF\u8C03\u51FA\u529B", "\u5907\u7528\u5BB9\u91CF", "\u8FD0\u884C\u673A\u7EC4\u6700\u5927\u632F\u52A8"],
    // 机组状态都是运行态、没有待办概念：概览待处理对机组模块恒为 0，异常只看故障停机。
    terminalStatuses: ["\u5F85\u542F\u52A8", "\u8FD0\u884C\u4E2D", "\u505C\u673A\u5907\u7528", "\u6545\u969C\u505C\u673A"],
    abnormalStatuses: ["\u6545\u969C\u505C\u673A"]
  },
  {
    key: "governor",
    name: "\u8C03\u901F\u5668",
    entity: "\u8C03\u901F\u5668",
    desc: "\u7EF4\u62A4\u8C03\u901F\u5668\uFF0C\u56F4\u7ED5\u88C5\u7F6E\u7F16\u53F7\u3001\u6240\u5C5E\u673A\u7EC4\u3001\u6CB9\u538B\u503C\u3001\u5BFC\u53F6\u5F00\u5EA6\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u88C5\u7F6E\u7F16\u53F7", "\u6240\u5C5E\u673A\u7EC4", "\u6CB9\u538B\u503C", "\u5BFC\u53F6\u5F00\u5EA6", "\u63A5\u529B\u5668\u884C\u7A0B", "\u5F00\u5EA6\u9650\u4F4D", "\u6821\u9A8C\u65E5\u671F", "\u88C5\u7F6E\u72B6\u6001"],
    statuses: ["\u5F85\u6821\u9A8C", "\u6B63\u5E38", "\u5F02\u5E38", "\u5DF2\u505C\u7528"],
    actions: ["\u63D0\u4EA4\u6821\u9A8C", "\u6807\u8BB0\u5F02\u5E38", "\u505C\u7528\u88C5\u7F6E"],
    actionTargets: { "\u63D0\u4EA4\u6821\u9A8C": "\u6B63\u5E38", "\u6807\u8BB0\u5F02\u5E38": "\u5F02\u5E38", "\u505C\u7528\u88C5\u7F6E": "\u5DF2\u505C\u7528" },
    metrics: ["\u6B63\u5E38\u8C03\u901F\u5668", "\u5F85\u6821\u9A8C\u88C5\u7F6E", "\u5F02\u5E38\u88C5\u7F6E"],
    abnormalStatuses: ["\u5F02\u5E38"]
  },
  {
    key: "excitation",
    name: "\u52B1\u78C1\u7CFB\u7EDF",
    entity: "\u52B1\u78C1\u88C5\u7F6E",
    desc: "\u7EF4\u62A4\u52B1\u78C1\u88C5\u7F6E\uFF0C\u56F4\u7ED5\u88C5\u7F6E\u7F16\u53F7\u3001\u6240\u5C5E\u673A\u7EC4\u3001\u52B1\u78C1\u7535\u538B\u3001\u52B1\u78C1\u7535\u6D41\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u88C5\u7F6E\u7F16\u53F7", "\u6240\u5C5E\u673A\u7EC4", "\u52B1\u78C1\u7535\u538B", "\u52B1\u78C1\u7535\u6D41", "\u53EF\u63A7\u7845\u6E29\u5EA6", "\u5F3A\u52B1\u6B21\u6570", "\u68C0\u67E5\u65E5\u671F", "\u88C5\u7F6E\u72B6\u6001"],
    statuses: ["\u5F85\u68C0\u67E5", "\u6B63\u5E38", "\u5F02\u5E38", "\u5DF2\u9000\u51FA"],
    actions: ["\u63D0\u4EA4\u68C0\u67E5", "\u6807\u8BB0\u5F02\u5E38", "\u9000\u51FA\u8FD0\u884C"],
    actionTargets: { "\u63D0\u4EA4\u68C0\u67E5": "\u6B63\u5E38", "\u6807\u8BB0\u5F02\u5E38": "\u5F02\u5E38", "\u9000\u51FA\u8FD0\u884C": "\u5DF2\u9000\u51FA" },
    metrics: ["\u6B63\u5E38\u88C5\u7F6E", "\u5F02\u5E38\u88C5\u7F6E", "\u5F85\u68C0\u67E5\u88C5\u7F6E"],
    abnormalStatuses: ["\u5F02\u5E38"]
  },
  {
    key: "transformer",
    name: "\u4E3B\u53D8\u538B\u5668",
    entity: "\u4E3B\u53D8\u538B\u5668",
    desc: "\u7EF4\u62A4\u4E3B\u53D8\u538B\u5668\uFF0C\u56F4\u7ED5\u53D8\u538B\u5668\u7F16\u53F7\u3001\u5BB9\u91CF\u7B49\u7EA7\u3001\u6CB9\u6E29\u3001\u7ED5\u7EC4\u6E29\u5EA6\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u53D8\u538B\u5668\u7F16\u53F7", "\u5BB9\u91CF\u7B49\u7EA7", "\u6CB9\u6E29", "\u7ED5\u7EC4\u6E29\u5EA6", "\u6CB9\u4F4D", "\u74E6\u65AF\u4FDD\u62A4", "\u8BD5\u9A8C\u65E5\u671F", "\u8FD0\u884C\u72B6\u6001"],
    statuses: ["\u5F85\u8BD5\u9A8C", "\u8FD0\u884C\u4E2D", "\u544A\u8B66", "\u505C\u8FD0"],
    actions: ["\u63D0\u4EA4\u8BD5\u9A8C", "\u53D1\u5E03\u544A\u8B66", "\u505C\u8FD0\u68C0\u4FEE"],
    actionTargets: { "\u63D0\u4EA4\u8BD5\u9A8C": "\u8FD0\u884C\u4E2D", "\u53D1\u5E03\u544A\u8B66": "\u544A\u8B66", "\u505C\u8FD0\u68C0\u4FEE": "\u505C\u8FD0" },
    metrics: ["\u8FD0\u884C\u53D8\u538B\u5668", "\u544A\u8B66\u53D8\u538B\u5668", "\u5F85\u8BD5\u9A8C\u53D8\u538B\u5668"],
    abnormalStatuses: ["\u544A\u8B66"]
  },
  {
    key: "gate",
    name: "\u95F8\u95E8\u542F\u95ED",
    entity: "\u95F8\u95E8",
    desc: "\u7EF4\u62A4\u95F8\u95E8\uFF0C\u56F4\u7ED5\u95F8\u95E8\u7F16\u53F7\u3001\u95F8\u95E8\u7C7B\u578B\u3001\u5B54\u53E3\u5C3A\u5BF8\u3001\u5F53\u524D\u5F00\u5EA6\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u95F8\u95E8\u7F16\u53F7", "\u95F8\u95E8\u7C7B\u578B", "\u5B54\u53E3\u5C3A\u5BF8", "\u5F53\u524D\u5F00\u5EA6", "\u542F\u95ED\u673A\u578B\u53F7", "\u64CD\u4F5C\u4EBA\u5458", "\u64CD\u4F5C\u65F6\u95F4", "\u95F8\u95E8\u72B6\u6001"],
    statuses: ["\u5F85\u64CD\u4F5C", "\u8FD0\u884C\u4E2D", "\u5DF2\u5173\u95ED", "\u6545\u969C"],
    actions: ["\u5F00\u542F\u95F8\u95E8", "\u5173\u95ED\u95F8\u95E8", "\u767B\u8BB0\u6545\u969C"],
    actionTargets: { "\u5F00\u542F\u95F8\u95E8": "\u8FD0\u884C\u4E2D", "\u5173\u95ED\u95F8\u95E8": "\u5DF2\u5173\u95ED", "\u767B\u8BB0\u6545\u969C": "\u6545\u969C" },
    metrics: ["\u5F00\u542F\u95F8\u95E8", "\u5173\u95ED\u95F8\u95E8", "\u6545\u969C\u95F8\u95E8"],
    abnormalStatuses: ["\u6545\u969C"]
  },
  {
    key: "seepage",
    name: "\u6E17\u6D41\u76D1\u6D4B",
    entity: "\u6E17\u6D41\u6D4B\u70B9",
    desc: "\u7EF4\u62A4\u6E17\u6D41\u6D4B\u70B9\uFF0C\u56F4\u7ED5\u6D4B\u70B9\u7F16\u53F7\u3001\u6D4B\u70B9\u4F4D\u7F6E\u3001\u6D4B\u538B\u7BA1\u6C34\u4F4D\u3001\u6E17\u6D41\u91CF\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u6D4B\u70B9\u7F16\u53F7", "\u6D4B\u70B9\u4F4D\u7F6E", "\u6D4B\u538B\u7BA1\u6C34\u4F4D", "\u6E17\u6D41\u91CF", "\u626C\u538B\u529B", "\u8B66\u6212\u6570\u503C", "\u76D1\u6D4B\u65E5\u671F", "\u6D4B\u70B9\u72B6\u6001"],
    statuses: ["\u6B63\u5E38", "\u9884\u8B66", "\u62A5\u8B66", "\u5DF2\u5904\u7406"],
    actions: ["\u63D0\u4EA4\u76D1\u6D4B", "\u53D1\u5E03\u9884\u8B66", "\u786E\u8BA4\u5904\u7406"],
    actionTargets: { "\u63D0\u4EA4\u76D1\u6D4B": "\u9884\u8B66", "\u53D1\u5E03\u9884\u8B66": "\u62A5\u8B66", "\u786E\u8BA4\u5904\u7406": "\u5DF2\u5904\u7406" },
    metrics: ["\u6B63\u5E38\u6D4B\u70B9", "\u9884\u8B66\u6D4B\u70B9", "\u6700\u5927\u6E17\u6D41\u91CF"],
    abnormalStatuses: ["\u9884\u8B66", "\u62A5\u8B66"]
  },
  {
    key: "displacement",
    name: "\u4F4D\u79FB\u76D1\u6D4B",
    entity: "\u4F4D\u79FB\u6D4B\u70B9",
    desc: "\u7EF4\u62A4\u4F4D\u79FB\u6D4B\u70B9\uFF0C\u56F4\u7ED5\u6D4B\u70B9\u7F16\u53F7\u3001\u6D4B\u70B9\u9AD8\u7A0B\u3001\u6C34\u5E73\u4F4D\u79FB\u3001\u5782\u76F4\u4F4D\u79FB\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u6D4B\u70B9\u7F16\u53F7", "\u6D4B\u70B9\u9AD8\u7A0B", "\u6C34\u5E73\u4F4D\u79FB", "\u5782\u76F4\u4F4D\u79FB", "\u7D2F\u8BA1\u4F4D\u79FB", "\u5141\u8BB8\u4F4D\u79FB", "\u76D1\u6D4B\u9891\u6B21", "\u6D4B\u70B9\u72B6\u6001"],
    statuses: ["\u5F85\u89C2\u6D4B", "\u89C2\u6D4B\u4E2D", "\u8D85\u9650", "\u5DF2\u590D\u6838"],
    actions: ["\u63D0\u4EA4\u89C2\u6D4B", "\u6807\u8BB0\u8D85\u9650", "\u63D0\u4EA4\u590D\u6838"],
    actionTargets: { "\u63D0\u4EA4\u89C2\u6D4B": "\u89C2\u6D4B\u4E2D", "\u6807\u8BB0\u8D85\u9650": "\u8D85\u9650", "\u63D0\u4EA4\u590D\u6838": "\u5DF2\u590D\u6838" },
    metrics: ["\u89C2\u6D4B\u4E2D\u6D4B\u70B9", "\u8D85\u9650\u6D4B\u70B9", "\u5E73\u5747\u4F4D\u79FB"],
    abnormalStatuses: ["\u8D85\u9650"]
  },
  {
    key: "trashrack",
    name: "\u62E6\u6C61\u6805",
    entity: "\u62E6\u6C61\u6805",
    desc: "\u7EF4\u62A4\u62E6\u6C61\u6805\uFF0C\u56F4\u7ED5\u6805\u4F53\u7F16\u53F7\u3001\u6240\u5C5E\u673A\u7EC4\u3001\u524D\u540E\u538B\u5DEE\u3001\u6E05\u6C61\u6B21\u6570\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u6805\u4F53\u7F16\u53F7", "\u6240\u5C5E\u673A\u7EC4", "\u524D\u540E\u538B\u5DEE", "\u6E05\u6C61\u6B21\u6570", "\u6E05\u6C61\u65B9\u5F0F", "\u6E05\u7406\u65E5\u671F", "\u6E05\u7406\u4EBA\u5458", "\u6805\u4F53\u72B6\u6001"],
    statuses: ["\u5F85\u6E05\u7406", "\u6E05\u7406\u4E2D", "\u5DF2\u6E05\u7406", "\u5DF2\u635F\u574F"],
    actions: ["\u5B89\u6392\u6E05\u7406", "\u786E\u8BA4\u5B8C\u6210", "\u767B\u8BB0\u635F\u574F"],
    actionTargets: { "\u5B89\u6392\u6E05\u7406": "\u6E05\u7406\u4E2D", "\u786E\u8BA4\u5B8C\u6210": "\u5DF2\u6E05\u7406", "\u767B\u8BB0\u635F\u574F": "\u5DF2\u635F\u574F" },
    metrics: ["\u5F85\u6E05\u7406\u6805\u4F53", "\u5DF2\u6E05\u7406\u6805\u4F53", "\u6700\u5927\u538B\u5DEE"],
    abnormalStatuses: ["\u5DF2\u635F\u574F"]
  },
  {
    key: "overhaul",
    name: "\u673A\u7EC4\u68C0\u4FEE",
    entity: "\u68C0\u4FEE\u5DE5\u4F5C\u7968",
    desc: "\u7EF4\u62A4\u68C0\u4FEE\u5DE5\u4F5C\u7968\uFF0C\u56F4\u7ED5\u5DE5\u4F5C\u7968\u53F7\u3001\u68C0\u4FEE\u673A\u7EC4\u3001\u68C0\u4FEE\u7EA7\u522B\u3001\u8BA1\u5212\u5DE5\u671F\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u63A8\u8FDB\uFF1B\u5F00\u5DE5\u8D44\u683C\u4E0E\u673A\u7EC4\u9875\u540C\u6E90\u3002",
    // 新增「关联机组」：检修票与机组用机组编号硬关联，开工/完工闭环都要回写机组。
    fields: ["\u5DE5\u4F5C\u7968\u53F7", "\u5173\u8054\u673A\u7EC4", "\u68C0\u4FEE\u7EA7\u522B", "\u8BA1\u5212\u5DE5\u671F", "\u5B9E\u9645\u5DE5\u671F", "\u5DE5\u4F5C\u8D1F\u8D23\u4EBA", "\u9A8C\u6536\u4EBA\u5458", "\u68C0\u4FEE\u72B6\u6001"],
    statuses: ["\u5F85\u5BA1\u6279", "\u5DF2\u6279\u51C6", "\u68C0\u4FEE\u4E2D", "\u5DF2\u5B8C\u5DE5"],
    actions: ["\u63D0\u4EA4\u5BA1\u6279", "\u5F00\u5DE5\u68C0\u4FEE", "\u529E\u7406\u5B8C\u5DE5"],
    actionTargets: { "\u63D0\u4EA4\u5BA1\u6279": "\u5DF2\u6279\u51C6", "\u5F00\u5DE5\u68C0\u4FEE": "\u68C0\u4FEE\u4E2D", "\u529E\u7406\u5B8C\u5DE5": "\u5DF2\u5B8C\u5DE5" },
    metrics: ["\u5F85\u5BA1\u6279\u5DE5\u4F5C\u7968", "\u53EF\u5F00\u5DE5\u5DE5\u4F5C\u7968", "\u68C0\u4FEE\u4E2D\u673A\u7EC4"],
    abnormalStatuses: []
  },
  {
    key: "bearing",
    name: "\u5BFC\u8F74\u627F",
    entity: "\u5BFC\u8F74\u627F",
    desc: "\u7EF4\u62A4\u5BFC\u8F74\u627F\uFF0C\u56F4\u7ED5\u8F74\u627F\u7F16\u53F7\u3001\u6240\u5C5E\u673A\u7EC4\u3001\u4E0A\u5BFC\u6E29\u5EA6\u3001\u4E0B\u5BFC\u6E29\u5EA6\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u8F74\u627F\u7F16\u53F7", "\u6240\u5C5E\u673A\u7EC4", "\u4E0A\u5BFC\u6E29\u5EA6", "\u4E0B\u5BFC\u6E29\u5EA6", "\u6CB9\u4F4D\u9AD8\u5EA6", "\u632F\u52A8\u6570\u503C", "\u68C0\u6D4B\u65E5\u671F", "\u8F74\u627F\u72B6\u6001"],
    statuses: ["\u6B63\u5E38", "\u6E29\u5EA6\u504F\u9AD8", "\u5F85\u68C0\u4FEE", "\u5DF2\u68C0\u4FEE"],
    actions: ["\u63D0\u4EA4\u68C0\u6D4B", "\u6807\u8BB0\u504F\u9AD8", "\u786E\u8BA4\u68C0\u4FEE"],
    actionTargets: { "\u63D0\u4EA4\u68C0\u6D4B": "\u6E29\u5EA6\u504F\u9AD8", "\u6807\u8BB0\u504F\u9AD8": "\u5F85\u68C0\u4FEE", "\u786E\u8BA4\u68C0\u4FEE": "\u5DF2\u68C0\u4FEE" },
    metrics: ["\u6B63\u5E38\u8F74\u627F", "\u6E29\u5EA6\u504F\u9AD8\u8F74\u627F", "\u5F85\u68C0\u4FEE\u8F74\u627F"],
    abnormalStatuses: ["\u6E29\u5EA6\u504F\u9AD8"]
  },
  {
    key: "cooling",
    name: "\u6280\u672F\u4F9B\u6C34",
    entity: "\u4F9B\u6C34\u7CFB\u7EDF",
    desc: "\u7EF4\u62A4\u4F9B\u6C34\u7CFB\u7EDF\uFF0C\u56F4\u7ED5\u7CFB\u7EDF\u7F16\u53F7\u3001\u4F9B\u6C34\u7C7B\u578B\u3001\u4F9B\u6C34\u538B\u529B\u3001\u4F9B\u6C34\u6D41\u91CF\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u7CFB\u7EDF\u7F16\u53F7", "\u4F9B\u6C34\u7C7B\u578B", "\u4F9B\u6C34\u538B\u529B", "\u4F9B\u6C34\u6D41\u91CF", "\u6C34\u6E29\u6570\u503C", "\u6EE4\u6C34\u5668\u538B\u5DEE", "\u68C0\u67E5\u65E5\u671F", "\u7CFB\u7EDF\u72B6\u6001"],
    statuses: ["\u5F85\u68C0\u67E5", "\u8FD0\u884C\u4E2D", "\u5F02\u5E38", "\u5DF2\u505C\u8FD0"],
    actions: ["\u63D0\u4EA4\u68C0\u67E5", "\u6807\u8BB0\u5F02\u5E38", "\u505C\u8FD0\u7CFB\u7EDF"],
    actionTargets: { "\u63D0\u4EA4\u68C0\u67E5": "\u8FD0\u884C\u4E2D", "\u6807\u8BB0\u5F02\u5E38": "\u5F02\u5E38", "\u505C\u8FD0\u7CFB\u7EDF": "\u5DF2\u505C\u8FD0" },
    metrics: ["\u8FD0\u884C\u7CFB\u7EDF", "\u5F02\u5E38\u7CFB\u7EDF", "\u5F85\u68C0\u67E5\u7CFB\u7EDF"],
    abnormalStatuses: ["\u5F02\u5E38"]
  },
  {
    key: "hydrology",
    name: "\u6C34\u60C5\u8C03\u5EA6",
    entity: "\u6C34\u60C5\u8BB0\u5F55",
    desc: "\u7EF4\u62A4\u6C34\u60C5\u8BB0\u5F55\uFF0C\u56F4\u7ED5\u8BB0\u5F55\u7F16\u53F7\u3001\u89C2\u6D4B\u65F6\u95F4\u3001\u4E0A\u6E38\u6C34\u4F4D\u3001\u4E0B\u6E38\u6C34\u4F4D\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u8BB0\u5F55\u7F16\u53F7", "\u89C2\u6D4B\u65F6\u95F4", "\u4E0A\u6E38\u6C34\u4F4D", "\u4E0B\u6E38\u6C34\u4F4D", "\u5165\u5E93\u6D41\u91CF", "\u51FA\u5E93\u6D41\u91CF", "\u503C\u5B88\u4EBA\u5458", "\u8C03\u5EA6\u72B6\u6001"],
    statuses: ["\u5F85\u89C2\u6D4B", "\u5DF2\u89C2\u6D4B", "\u5DF2\u8C03\u5EA6", "\u5DF2\u590D\u6838"],
    actions: ["\u63D0\u4EA4\u89C2\u6D4B", "\u4E0B\u8FBE\u8C03\u5EA6", "\u63D0\u4EA4\u590D\u6838"],
    actionTargets: { "\u63D0\u4EA4\u89C2\u6D4B": "\u5DF2\u89C2\u6D4B", "\u4E0B\u8FBE\u8C03\u5EA6": "\u5DF2\u8C03\u5EA6", "\u63D0\u4EA4\u590D\u6838": "\u5DF2\u590D\u6838" },
    metrics: ["\u4ECA\u65E5\u5165\u5E93\u6D41\u91CF", "\u4ECA\u65E5\u51FA\u5E93\u6D41\u91CF", "\u5F85\u8C03\u5EA6\u8BB0\u5F55"]
  },
  {
    key: "flood",
    name: "\u6CC4\u6D2A\u64CD\u4F5C",
    entity: "\u6CC4\u6D2A\u64CD\u4F5C",
    desc: "\u7EF4\u62A4\u6CC4\u6D2A\u64CD\u4F5C\uFF0C\u56F4\u7ED5\u64CD\u4F5C\u7F16\u53F7\u3001\u6CC4\u6D2A\u95F8\u53F7\u3001\u5F00\u542F\u5B54\u6570\u3001\u6CC4\u6D2A\u6D41\u91CF\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u64CD\u4F5C\u7F16\u53F7", "\u6CC4\u6D2A\u95F8\u53F7", "\u5F00\u542F\u5B54\u6570", "\u6CC4\u6D2A\u6D41\u91CF", "\u4E0B\u6E38\u9884\u8B66", "\u64CD\u4F5C\u65F6\u95F4", "\u64CD\u4F5C\u4EBA\u5458", "\u64CD\u4F5C\u72B6\u6001"],
    statuses: ["\u5F85\u5BA1\u6279", "\u5DF2\u6279\u51C6", "\u6CC4\u6D2A\u4E2D", "\u5DF2\u7ED3\u675F"],
    actions: ["\u63D0\u4EA4\u5BA1\u6279", "\u5F00\u542F\u6CC4\u6D2A", "\u7ED3\u675F\u6CC4\u6D2A"],
    actionTargets: { "\u63D0\u4EA4\u5BA1\u6279": "\u5DF2\u6279\u51C6", "\u5F00\u542F\u6CC4\u6D2A": "\u6CC4\u6D2A\u4E2D", "\u7ED3\u675F\u6CC4\u6D2A": "\u5DF2\u7ED3\u675F" },
    metrics: ["\u5F85\u5BA1\u6279\u64CD\u4F5C", "\u6CC4\u6D2A\u4E2D\u95F8\u95E8", "\u4ECA\u65E5\u6CC4\u6D2A\u91CF"]
  },
  {
    key: "generation",
    name: "\u53D1\u7535\u8BA1\u5212",
    entity: "\u53D1\u7535\u8BA1\u5212",
    desc: "\u7EF4\u62A4\u53D1\u7535\u8BA1\u5212\uFF0C\u56F4\u7ED5\u8BA1\u5212\u7F16\u53F7\u3001\u8BA1\u5212\u65E5\u671F\u3001\u8BA1\u5212\u51FA\u529B\u3001\u5B9E\u9645\u51FA\u529B\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u63A8\u8FDB\uFF1B\u53EF\u8C03\u51FA\u529B\u5B9E\u65F6\u53D6\u81EA\u673A\u7EC4\u8FD0\u884C\u9875\u3002",
    fields: ["\u8BA1\u5212\u7F16\u53F7", "\u8BA1\u5212\u65E5\u671F", "\u8BA1\u5212\u51FA\u529B", "\u5B9E\u9645\u51FA\u529B", "\u65E5\u53D1\u7535\u91CF", "\u4E0A\u7F51\u7535\u91CF", "\u5B8C\u6210\u6BD4\u7387", "\u8BA1\u5212\u72B6\u6001"],
    statuses: ["\u5F85\u7F16\u5236", "\u5DF2\u4E0B\u8FBE", "\u6267\u884C\u4E2D", "\u5DF2\u5B8C\u6210"],
    actions: ["\u63D0\u4EA4\u7F16\u5236", "\u4E0B\u8FBE\u8BA1\u5212", "\u786E\u8BA4\u5B8C\u6210"],
    actionTargets: { "\u63D0\u4EA4\u7F16\u5236": "\u5DF2\u4E0B\u8FBE", "\u4E0B\u8FBE\u8BA1\u5212": "\u6267\u884C\u4E2D", "\u786E\u8BA4\u5B8C\u6210": "\u5DF2\u5B8C\u6210" },
    metrics: ["\u53EF\u8C03\u51FA\u529B", "\u8BA1\u5212\u51FA\u529B\u5408\u8BA1", "\u6267\u884C\u4E2D\u8BA1\u5212"]
  },
  {
    key: "protection",
    name: "\u7EE7\u7535\u4FDD\u62A4",
    entity: "\u4FDD\u62A4\u88C5\u7F6E",
    desc: "\u7EF4\u62A4\u4FDD\u62A4\u88C5\u7F6E\uFF0C\u56F4\u7ED5\u88C5\u7F6E\u7F16\u53F7\u3001\u4FDD\u62A4\u7C7B\u578B\u3001\u5B9A\u503C\u5355\u53F7\u3001\u4E0A\u6B21\u6821\u9A8C\u65E5\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u88C5\u7F6E\u7F16\u53F7", "\u4FDD\u62A4\u7C7B\u578B", "\u5B9A\u503C\u5355\u53F7", "\u4E0A\u6B21\u6821\u9A8C\u65E5", "\u4E0B\u6B21\u6821\u9A8C\u65E5", "\u52A8\u4F5C\u6B21\u6570", "\u6821\u9A8C\u4EBA\u5458", "\u88C5\u7F6E\u72B6\u6001"],
    statuses: ["\u5F85\u6821\u9A8C", "\u6B63\u5E38", "\u5F02\u5E38", "\u5DF2\u9000\u51FA"],
    actions: ["\u63D0\u4EA4\u6821\u9A8C", "\u6807\u8BB0\u5F02\u5E38", "\u9000\u51FA\u8FD0\u884C"],
    actionTargets: { "\u63D0\u4EA4\u6821\u9A8C": "\u6B63\u5E38", "\u6807\u8BB0\u5F02\u5E38": "\u5F02\u5E38", "\u9000\u51FA\u8FD0\u884C": "\u5DF2\u9000\u51FA" },
    metrics: ["\u6B63\u5E38\u4FDD\u62A4\u88C5\u7F6E", "\u5F85\u6821\u9A8C\u88C5\u7F6E", "\u5373\u5C06\u5230\u671F\u88C5\u7F6E"],
    abnormalStatuses: ["\u5F02\u5E38"]
  },
  {
    key: "defect",
    name: "\u7F3A\u9677\u5904\u7F6E",
    entity: "\u8BBE\u5907\u7F3A\u9677",
    desc: "\u7EF4\u62A4\u8BBE\u5907\u7F3A\u9677\uFF0C\u56F4\u7ED5\u7F3A\u9677\u7F16\u53F7\u3001\u8BBE\u5907\u540D\u79F0\u3001\u7F3A\u9677\u63CF\u8FF0\u3001\u7F3A\u9677\u7B49\u7EA7\u505A\u767B\u8BB0\u4E0E\u5355\u5411\u6D41\u8F6C\uFF1B\u5B8C\u6210\u540E\u5F52\u6863\u3002",
    // 「缺陷状态」字段移除：只认 status。新增来源字段标记台账补录/故障联动。
    fields: ["\u7F3A\u9677\u7F16\u53F7", "\u8BBE\u5907\u540D\u79F0", "\u7F3A\u9677\u63CF\u8FF0", "\u7F3A\u9677\u7B49\u7EA7", "\u53D1\u73B0\u65E5\u671F", "\u5904\u7406\u671F\u9650", "\u5904\u7406\u4EBA\u5458", "\u6765\u6E90"],
    // 单向链：待处理→处理中→已完成→已归档，没有回头路。
    statuses: ["\u5F85\u5904\u7406", "\u5904\u7406\u4E2D", "\u5DF2\u5B8C\u6210", "\u5DF2\u5F52\u6863"],
    actions: ["\u6D3E\u53D1\u5904\u7406", "\u786E\u8BA4\u6D88\u9664", "\u5F52\u6863"],
    actionTargets: { "\u6D3E\u53D1\u5904\u7406": "\u5904\u7406\u4E2D", "\u786E\u8BA4\u6D88\u9664": "\u5DF2\u5B8C\u6210", "\u5F52\u6863": "\u5DF2\u5F52\u6863" },
    metrics: ["\u5F85\u5904\u7406\u7F3A\u9677", "\u5904\u7406\u4E2D\u7F3A\u9677", "\u5DF2\u5B8C\u6210\u5F85\u5F52\u6863", "\u5DF2\u5F52\u6863\u7F3A\u9677"]
  },
  {
    key: "crew",
    name: "\u68C0\u4FEE\u4EBA\u5458",
    entity: "\u68C0\u4FEE\u4EBA\u5458",
    desc: "\u7EF4\u62A4\u68C0\u4FEE\u4EBA\u5458\uFF0C\u56F4\u7ED5\u4EBA\u5458\u7F16\u53F7\u3001\u59D3\u540D\u3001\u5C97\u4F4D\u3001\u6301\u8BC1\u7C7B\u578B\u505A\u767B\u8BB0\u3001\u7B5B\u9009\u4E0E\u72B6\u6001\u6D41\u8F6C\u3002",
    fields: ["\u4EBA\u5458\u7F16\u53F7", "\u59D3\u540D", "\u5C97\u4F4D", "\u6301\u8BC1\u7C7B\u578B", "\u8BC1\u4E66\u6709\u6548\u671F", "\u6240\u5C5E\u73ED\u7EC4", "\u8054\u7CFB\u7535\u8BDD", "\u5728\u573A\u72B6\u6001"],
    statuses: ["\u5F85\u8FDB\u573A", "\u5728\u573A", "\u5DF2\u79BB\u573A", "\u5DF2\u505C\u5DE5"],
    actions: ["\u529E\u7406\u8FDB\u573A", "\u529E\u7406\u79BB\u573A", "\u767B\u8BB0\u505C\u5DE5"],
    actionTargets: { "\u529E\u7406\u8FDB\u573A": "\u5728\u573A", "\u529E\u7406\u79BB\u573A": "\u5DF2\u79BB\u573A", "\u767B\u8BB0\u505C\u5DE5": "\u5DF2\u505C\u5DE5" },
    metrics: ["\u5728\u573A\u4EBA\u5458", "\u6301\u8BC1\u4EBA\u5458", "\u8BC1\u4E66\u5373\u5C06\u5230\u671F"]
  },
  {
    key: "spare",
    name: "\u5907\u54C1\u5907\u4EF6",
    entity: "\u5907\u54C1\u5907\u4EF6",
    desc: "\u7EF4\u62A4\u5907\u54C1\u5907\u4EF6\uFF0C\u56F4\u7ED5\u5907\u4EF6\u7F16\u53F7\u3001\u5907\u4EF6\u540D\u79F0\u3001\u89C4\u683C\u578B\u53F7\u3001\u9002\u7528\u8BBE\u5907\u505A\u767B\u8BB0\u4E0E\u9886\u7528\uFF1B\u91CD\u590D\u63D0\u4EA4\u53EA\u6263\u4E00\u6B21\u6570\u91CF\u3002",
    fields: ["\u5907\u4EF6\u7F16\u53F7", "\u5907\u4EF6\u540D\u79F0", "\u89C4\u683C\u578B\u53F7", "\u9002\u7528\u8BBE\u5907", "\u5B58\u653E\u4F4D\u7F6E", "\u73B0\u6709\u6570\u91CF", "\u6700\u4F4E\u50A8\u5907\u91CF", "\u7D2F\u8BA1\u9886\u7528"],
    statuses: ["\u5F85\u9A8C\u6536", "\u5DF2\u767B\u8BB0", "\u5DF2\u9886\u7528", "\u5F85\u8865\u5145"],
    actions: ["\u529E\u7406\u9A8C\u6536", "\u9886\u7528\u5907\u4EF6", "\u63D0\u4EA4\u8865\u5145"],
    actionTargets: { "\u529E\u7406\u9A8C\u6536": "\u5DF2\u767B\u8BB0", "\u9886\u7528\u5907\u4EF6": "\u5DF2\u9886\u7528", "\u63D0\u4EA4\u8865\u5145": "\u5F85\u8865\u5145" },
    metrics: ["\u5728\u5E93\u5907\u4EF6", "\u5E93\u5B58\u603B\u91CF", "\u672C\u6708\u9886\u7528"],
    abnormalStatuses: ["\u5F85\u8865\u5145"]
  }
];
var MODULE_BY_KEY = new Map(
  MODULES.map((item) => [item.key, item])
);

// src/data/seed.ts
var SEED_ROWS = {
  "station": [
    {
      "id": 1,
      "status": "\u5728\u5EFA",
      "pending": true,
      "abnormal": false,
      "\u7535\u7AD9\u7F16\u53F7": "STAT-0001",
      "\u7535\u7AD9\u540D\u79F0": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B1",
      "\u88C5\u673A\u5BB9\u91CF": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B1",
      "\u673A\u7EC4\u53F0\u6570": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B1",
      "\u8BBE\u8BA1\u6C34\u5934": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B1",
      "\u6295\u8FD0\u65E5\u671F": "2026-09-01",
      "\u6240\u5C5E\u6D41\u57DF": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B1",
      "\u8FD0\u884C\u72B6\u6001": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u8BD5\u8FD0\u884C",
      "pending": true,
      "abnormal": true,
      "\u7535\u7AD9\u7F16\u53F7": "STAT-0002",
      "\u7535\u7AD9\u540D\u79F0": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B2",
      "\u88C5\u673A\u5BB9\u91CF": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B2",
      "\u673A\u7EC4\u53F0\u6570": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B2",
      "\u8BBE\u8BA1\u6C34\u5934": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B2",
      "\u6295\u8FD0\u65E5\u671F": "2026-09-02",
      "\u6240\u5C5E\u6D41\u57DF": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B2",
      "\u8FD0\u884C\u72B6\u6001": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u6B63\u5E38\u8FD0\u884C",
      "pending": false,
      "abnormal": false,
      "\u7535\u7AD9\u7F16\u53F7": "STAT-0003",
      "\u7535\u7AD9\u540D\u79F0": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B3",
      "\u88C5\u673A\u5BB9\u91CF": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B3",
      "\u673A\u7EC4\u53F0\u6570": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B3",
      "\u8BBE\u8BA1\u6C34\u5934": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B3",
      "\u6295\u8FD0\u65E5\u671F": "2026-09-03",
      "\u6240\u5C5E\u6D41\u57DF": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B3",
      "\u8FD0\u884C\u72B6\u6001": "\u7535\u7AD9\u53F0\u8D26\u6837\u4F8B3"
    }
  ],
  "unit": [
    {
      "id": 1,
      "status": "\u8FD0\u884C\u4E2D",
      "pending": false,
      "abnormal": false,
      "\u673A\u7EC4\u7F16\u53F7": "UNIT-0001",
      "\u673A\u7EC4\u578B\u53F7": "HLF100-LJ-300",
      "\u989D\u5B9A\u8F6C\u901F": 300,
      "\u6709\u529F\u51FA\u529B": 50,
      "\u65E0\u529F\u51FA\u529B": 12,
      "\u7D2F\u8BA1\u8FD0\u884C\u5C0F\u65F6": 0,
      "\u632F\u52A8\u6570\u503C": 0.08,
      "\u5E76\u7F51\u65F6\u523B": "2026-10-05T08:00:00",
      "\u505C\u673A\u65F6\u523B": "",
      "\u53F0\u8D26": [
        { "from": "\u505C\u673A\u5907\u7528", "to": "\u5F85\u542F\u52A8", "action": "\u6062\u590D\u5F85\u542F\u52A8", "at": "2026-10-05T07:30:00", "source": "\u64AD\u79CD\u6570\u636E" },
        { "from": "\u5F85\u542F\u52A8", "to": "\u8FD0\u884C\u4E2D", "action": "\u5F00\u673A\u5E76\u7F51", "at": "2026-10-05T08:00:00", "source": "\u64AD\u79CD\u6570\u636E" }
      ]
    },
    {
      "id": 2,
      "status": "\u505C\u673A\u5907\u7528",
      "pending": true,
      "abnormal": false,
      "\u673A\u7EC4\u7F16\u53F7": "UNIT-0002",
      "\u673A\u7EC4\u578B\u53F7": "HLF100-LJ-300",
      "\u989D\u5B9A\u8F6C\u901F": 300,
      "\u6709\u529F\u51FA\u529B": 40,
      "\u65E0\u529F\u51FA\u529B": 10,
      "\u7D2F\u8BA1\u8FD0\u884C\u5C0F\u65F6": 126.5,
      "\u632F\u52A8\u6570\u503C": 0,
      "\u5E76\u7F51\u65F6\u523B": "",
      "\u505C\u673A\u65F6\u523B": "2026-10-04T22:00:00",
      "\u53F0\u8D26": [
        { "from": "\u8FD0\u884C\u4E2D", "to": "\u505C\u673A\u5907\u7528", "action": "\u505C\u673A\u8F6C\u5907", "at": "2026-10-04T22:00:00", "source": "\u64AD\u79CD\u6570\u636E", "note": "\u7D2F\u8BA1\u8FD0\u884C\u5C0F\u65F6\u5728\u505C\u673A\u65F6\u523B\u7ED3\u7B97" }
      ]
    },
    {
      "id": 3,
      "status": "\u5F85\u542F\u52A8",
      "pending": true,
      "abnormal": false,
      "\u673A\u7EC4\u7F16\u53F7": "UNIT-0003",
      "\u673A\u7EC4\u578B\u53F7": "ZZ560-LH-450",
      "\u989D\u5B9A\u8F6C\u901F": 187.5,
      "\u6709\u529F\u51FA\u529B": 75,
      "\u65E0\u529F\u51FA\u529B": 18,
      "\u7D2F\u8BA1\u8FD0\u884C\u5C0F\u65F6": 542,
      "\u632F\u52A8\u6570\u503C": 0,
      "\u5E76\u7F51\u65F6\u523B": "",
      "\u505C\u673A\u65F6\u523B": "2026-10-03T06:00:00",
      "\u53F0\u8D26": [
        { "from": "\u8FD0\u884C\u4E2D", "to": "\u505C\u673A\u5907\u7528", "action": "\u505C\u673A\u8F6C\u5907", "at": "2026-10-03T06:00:00", "source": "\u64AD\u79CD\u6570\u636E" },
        { "from": "\u505C\u673A\u5907\u7528", "to": "\u5F85\u542F\u52A8", "action": "\u6062\u590D\u5F85\u542F\u52A8", "at": "2026-10-03T06:20:00", "source": "\u64AD\u79CD\u6570\u636E" }
      ]
    },
    {
      "id": 4,
      "status": "\u6545\u969C\u505C\u673A",
      "pending": false,
      "abnormal": true,
      "\u673A\u7EC4\u7F16\u53F7": "UNIT-0004",
      "\u673A\u7EC4\u578B\u53F7": "ZZ560-LH-450",
      "\u989D\u5B9A\u8F6C\u901F": 187.5,
      "\u6709\u529F\u51FA\u529B": 60,
      "\u65E0\u529F\u51FA\u529B": 15,
      "\u7D2F\u8BA1\u8FD0\u884C\u5C0F\u65F6": 88.2,
      "\u632F\u52A8\u6570\u503C": 0,
      "\u5E76\u7F51\u65F6\u523B": "",
      "\u505C\u673A\u65F6\u523B": "2026-10-05T03:10:00",
      "\u53F0\u8D26": [
        { "from": "\u5F85\u542F\u52A8", "to": "\u8FD0\u884C\u4E2D", "action": "\u5F00\u673A\u5E76\u7F51", "at": "2026-10-04T18:00:00", "source": "\u64AD\u79CD\u6570\u636E" },
        { "from": "\u8FD0\u884C\u4E2D", "to": "\u6545\u969C\u505C\u673A", "action": "\u767B\u8BB0\u6545\u969C", "at": "2026-10-05T03:10:00", "source": "\u64AD\u79CD\u6570\u636E", "note": "\u632F\u52A8\u8D8A\u9650\u4FDD\u62A4\u8DF3\u95F8" }
      ]
    }
  ],
  "governor": [
    {
      "id": 1,
      "status": "\u5F85\u6821\u9A8C",
      "pending": true,
      "abnormal": false,
      "\u88C5\u7F6E\u7F16\u53F7": "GOVE-0001",
      "\u6240\u5C5E\u673A\u7EC4": "\u8C03\u901F\u5668\u6837\u4F8B1",
      "\u6CB9\u538B\u503C": "\u8C03\u901F\u5668\u6837\u4F8B1",
      "\u5BFC\u53F6\u5F00\u5EA6": "\u8C03\u901F\u5668\u6837\u4F8B1",
      "\u63A5\u529B\u5668\u884C\u7A0B": "\u8C03\u901F\u5668\u6837\u4F8B1",
      "\u5F00\u5EA6\u9650\u4F4D": "\u8C03\u901F\u5668\u6837\u4F8B1",
      "\u6821\u9A8C\u65E5\u671F": "2026-09-01",
      "\u88C5\u7F6E\u72B6\u6001": "\u8C03\u901F\u5668\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u6B63\u5E38",
      "pending": true,
      "abnormal": true,
      "\u88C5\u7F6E\u7F16\u53F7": "GOVE-0002",
      "\u6240\u5C5E\u673A\u7EC4": "\u8C03\u901F\u5668\u6837\u4F8B2",
      "\u6CB9\u538B\u503C": "\u8C03\u901F\u5668\u6837\u4F8B2",
      "\u5BFC\u53F6\u5F00\u5EA6": "\u8C03\u901F\u5668\u6837\u4F8B2",
      "\u63A5\u529B\u5668\u884C\u7A0B": "\u8C03\u901F\u5668\u6837\u4F8B2",
      "\u5F00\u5EA6\u9650\u4F4D": "\u8C03\u901F\u5668\u6837\u4F8B2",
      "\u6821\u9A8C\u65E5\u671F": "2026-09-02",
      "\u88C5\u7F6E\u72B6\u6001": "\u8C03\u901F\u5668\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u5F02\u5E38",
      "pending": false,
      "abnormal": false,
      "\u88C5\u7F6E\u7F16\u53F7": "GOVE-0003",
      "\u6240\u5C5E\u673A\u7EC4": "\u8C03\u901F\u5668\u6837\u4F8B3",
      "\u6CB9\u538B\u503C": "\u8C03\u901F\u5668\u6837\u4F8B3",
      "\u5BFC\u53F6\u5F00\u5EA6": "\u8C03\u901F\u5668\u6837\u4F8B3",
      "\u63A5\u529B\u5668\u884C\u7A0B": "\u8C03\u901F\u5668\u6837\u4F8B3",
      "\u5F00\u5EA6\u9650\u4F4D": "\u8C03\u901F\u5668\u6837\u4F8B3",
      "\u6821\u9A8C\u65E5\u671F": "2026-09-03",
      "\u88C5\u7F6E\u72B6\u6001": "\u8C03\u901F\u5668\u6837\u4F8B3"
    }
  ],
  "excitation": [
    {
      "id": 1,
      "status": "\u5F85\u68C0\u67E5",
      "pending": true,
      "abnormal": false,
      "\u88C5\u7F6E\u7F16\u53F7": "EXCI-0001",
      "\u6240\u5C5E\u673A\u7EC4": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B1",
      "\u52B1\u78C1\u7535\u538B": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B1",
      "\u52B1\u78C1\u7535\u6D41": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B1",
      "\u53EF\u63A7\u7845\u6E29\u5EA6": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B1",
      "\u5F3A\u52B1\u6B21\u6570": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B1",
      "\u68C0\u67E5\u65E5\u671F": "2026-09-01",
      "\u88C5\u7F6E\u72B6\u6001": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u6B63\u5E38",
      "pending": true,
      "abnormal": true,
      "\u88C5\u7F6E\u7F16\u53F7": "EXCI-0002",
      "\u6240\u5C5E\u673A\u7EC4": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B2",
      "\u52B1\u78C1\u7535\u538B": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B2",
      "\u52B1\u78C1\u7535\u6D41": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B2",
      "\u53EF\u63A7\u7845\u6E29\u5EA6": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B2",
      "\u5F3A\u52B1\u6B21\u6570": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B2",
      "\u68C0\u67E5\u65E5\u671F": "2026-09-02",
      "\u88C5\u7F6E\u72B6\u6001": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u5F02\u5E38",
      "pending": false,
      "abnormal": false,
      "\u88C5\u7F6E\u7F16\u53F7": "EXCI-0003",
      "\u6240\u5C5E\u673A\u7EC4": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B3",
      "\u52B1\u78C1\u7535\u538B": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B3",
      "\u52B1\u78C1\u7535\u6D41": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B3",
      "\u53EF\u63A7\u7845\u6E29\u5EA6": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B3",
      "\u5F3A\u52B1\u6B21\u6570": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B3",
      "\u68C0\u67E5\u65E5\u671F": "2026-09-03",
      "\u88C5\u7F6E\u72B6\u6001": "\u52B1\u78C1\u7CFB\u7EDF\u6837\u4F8B3"
    }
  ],
  "transformer": [
    {
      "id": 1,
      "status": "\u5F85\u8BD5\u9A8C",
      "pending": true,
      "abnormal": false,
      "\u53D8\u538B\u5668\u7F16\u53F7": "TRAN-0001",
      "\u5BB9\u91CF\u7B49\u7EA7": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B1",
      "\u6CB9\u6E29": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B1",
      "\u7ED5\u7EC4\u6E29\u5EA6": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B1",
      "\u6CB9\u4F4D": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B1",
      "\u74E6\u65AF\u4FDD\u62A4": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B1",
      "\u8BD5\u9A8C\u65E5\u671F": "2026-09-01",
      "\u8FD0\u884C\u72B6\u6001": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u8FD0\u884C\u4E2D",
      "pending": true,
      "abnormal": true,
      "\u53D8\u538B\u5668\u7F16\u53F7": "TRAN-0002",
      "\u5BB9\u91CF\u7B49\u7EA7": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B2",
      "\u6CB9\u6E29": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B2",
      "\u7ED5\u7EC4\u6E29\u5EA6": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B2",
      "\u6CB9\u4F4D": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B2",
      "\u74E6\u65AF\u4FDD\u62A4": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B2",
      "\u8BD5\u9A8C\u65E5\u671F": "2026-09-02",
      "\u8FD0\u884C\u72B6\u6001": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u544A\u8B66",
      "pending": false,
      "abnormal": false,
      "\u53D8\u538B\u5668\u7F16\u53F7": "TRAN-0003",
      "\u5BB9\u91CF\u7B49\u7EA7": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B3",
      "\u6CB9\u6E29": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B3",
      "\u7ED5\u7EC4\u6E29\u5EA6": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B3",
      "\u6CB9\u4F4D": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B3",
      "\u74E6\u65AF\u4FDD\u62A4": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B3",
      "\u8BD5\u9A8C\u65E5\u671F": "2026-09-03",
      "\u8FD0\u884C\u72B6\u6001": "\u4E3B\u53D8\u538B\u5668\u6837\u4F8B3"
    }
  ],
  "gate": [
    {
      "id": 1,
      "status": "\u5F85\u64CD\u4F5C",
      "pending": true,
      "abnormal": false,
      "\u95F8\u95E8\u7F16\u53F7": "GATE-0001",
      "\u95F8\u95E8\u7C7B\u578B": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B1",
      "\u5B54\u53E3\u5C3A\u5BF8": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B1",
      "\u5F53\u524D\u5F00\u5EA6": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B1",
      "\u542F\u95ED\u673A\u578B\u53F7": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B1",
      "\u64CD\u4F5C\u4EBA\u5458": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B1",
      "\u64CD\u4F5C\u65F6\u95F4": "2026-09-01",
      "\u95F8\u95E8\u72B6\u6001": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u8FD0\u884C\u4E2D",
      "pending": true,
      "abnormal": true,
      "\u95F8\u95E8\u7F16\u53F7": "GATE-0002",
      "\u95F8\u95E8\u7C7B\u578B": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B2",
      "\u5B54\u53E3\u5C3A\u5BF8": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B2",
      "\u5F53\u524D\u5F00\u5EA6": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B2",
      "\u542F\u95ED\u673A\u578B\u53F7": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B2",
      "\u64CD\u4F5C\u4EBA\u5458": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B2",
      "\u64CD\u4F5C\u65F6\u95F4": "2026-09-02",
      "\u95F8\u95E8\u72B6\u6001": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u5DF2\u5173\u95ED",
      "pending": false,
      "abnormal": false,
      "\u95F8\u95E8\u7F16\u53F7": "GATE-0003",
      "\u95F8\u95E8\u7C7B\u578B": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B3",
      "\u5B54\u53E3\u5C3A\u5BF8": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B3",
      "\u5F53\u524D\u5F00\u5EA6": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B3",
      "\u542F\u95ED\u673A\u578B\u53F7": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B3",
      "\u64CD\u4F5C\u4EBA\u5458": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B3",
      "\u64CD\u4F5C\u65F6\u95F4": "2026-09-03",
      "\u95F8\u95E8\u72B6\u6001": "\u95F8\u95E8\u542F\u95ED\u6837\u4F8B3"
    }
  ],
  "seepage": [
    {
      "id": 1,
      "status": "\u6B63\u5E38",
      "pending": true,
      "abnormal": false,
      "\u6D4B\u70B9\u7F16\u53F7": "SEEP-0001",
      "\u6D4B\u70B9\u4F4D\u7F6E": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B1",
      "\u6D4B\u538B\u7BA1\u6C34\u4F4D": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B1",
      "\u6E17\u6D41\u91CF": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B1",
      "\u626C\u538B\u529B": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B1",
      "\u8B66\u6212\u6570\u503C": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B1",
      "\u76D1\u6D4B\u65E5\u671F": "2026-09-01",
      "\u6D4B\u70B9\u72B6\u6001": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u9884\u8B66",
      "pending": true,
      "abnormal": true,
      "\u6D4B\u70B9\u7F16\u53F7": "SEEP-0002",
      "\u6D4B\u70B9\u4F4D\u7F6E": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B2",
      "\u6D4B\u538B\u7BA1\u6C34\u4F4D": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B2",
      "\u6E17\u6D41\u91CF": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B2",
      "\u626C\u538B\u529B": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B2",
      "\u8B66\u6212\u6570\u503C": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B2",
      "\u76D1\u6D4B\u65E5\u671F": "2026-09-02",
      "\u6D4B\u70B9\u72B6\u6001": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u62A5\u8B66",
      "pending": false,
      "abnormal": false,
      "\u6D4B\u70B9\u7F16\u53F7": "SEEP-0003",
      "\u6D4B\u70B9\u4F4D\u7F6E": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B3",
      "\u6D4B\u538B\u7BA1\u6C34\u4F4D": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B3",
      "\u6E17\u6D41\u91CF": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B3",
      "\u626C\u538B\u529B": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B3",
      "\u8B66\u6212\u6570\u503C": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B3",
      "\u76D1\u6D4B\u65E5\u671F": "2026-09-03",
      "\u6D4B\u70B9\u72B6\u6001": "\u6E17\u6D41\u76D1\u6D4B\u6837\u4F8B3"
    }
  ],
  "displacement": [
    {
      "id": 1,
      "status": "\u5F85\u89C2\u6D4B",
      "pending": true,
      "abnormal": false,
      "\u6D4B\u70B9\u7F16\u53F7": "DISP-0001",
      "\u6D4B\u70B9\u9AD8\u7A0B": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B1",
      "\u6C34\u5E73\u4F4D\u79FB": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B1",
      "\u5782\u76F4\u4F4D\u79FB": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B1",
      "\u7D2F\u8BA1\u4F4D\u79FB": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B1",
      "\u5141\u8BB8\u4F4D\u79FB": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B1",
      "\u76D1\u6D4B\u9891\u6B21": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B1",
      "\u6D4B\u70B9\u72B6\u6001": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u89C2\u6D4B\u4E2D",
      "pending": true,
      "abnormal": true,
      "\u6D4B\u70B9\u7F16\u53F7": "DISP-0002",
      "\u6D4B\u70B9\u9AD8\u7A0B": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B2",
      "\u6C34\u5E73\u4F4D\u79FB": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B2",
      "\u5782\u76F4\u4F4D\u79FB": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B2",
      "\u7D2F\u8BA1\u4F4D\u79FB": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B2",
      "\u5141\u8BB8\u4F4D\u79FB": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B2",
      "\u76D1\u6D4B\u9891\u6B21": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B2",
      "\u6D4B\u70B9\u72B6\u6001": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u8D85\u9650",
      "pending": false,
      "abnormal": false,
      "\u6D4B\u70B9\u7F16\u53F7": "DISP-0003",
      "\u6D4B\u70B9\u9AD8\u7A0B": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B3",
      "\u6C34\u5E73\u4F4D\u79FB": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B3",
      "\u5782\u76F4\u4F4D\u79FB": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B3",
      "\u7D2F\u8BA1\u4F4D\u79FB": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B3",
      "\u5141\u8BB8\u4F4D\u79FB": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B3",
      "\u76D1\u6D4B\u9891\u6B21": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B3",
      "\u6D4B\u70B9\u72B6\u6001": "\u4F4D\u79FB\u76D1\u6D4B\u6837\u4F8B3"
    }
  ],
  "trashrack": [
    {
      "id": 1,
      "status": "\u5F85\u6E05\u7406",
      "pending": true,
      "abnormal": false,
      "\u6805\u4F53\u7F16\u53F7": "TRAS-0001",
      "\u6240\u5C5E\u673A\u7EC4": "\u62E6\u6C61\u6805\u6837\u4F8B1",
      "\u524D\u540E\u538B\u5DEE": "\u62E6\u6C61\u6805\u6837\u4F8B1",
      "\u6E05\u6C61\u6B21\u6570": "\u62E6\u6C61\u6805\u6837\u4F8B1",
      "\u6E05\u6C61\u65B9\u5F0F": "\u62E6\u6C61\u6805\u6837\u4F8B1",
      "\u6E05\u7406\u65E5\u671F": "2026-09-01",
      "\u6E05\u7406\u4EBA\u5458": "\u62E6\u6C61\u6805\u6837\u4F8B1",
      "\u6805\u4F53\u72B6\u6001": "\u62E6\u6C61\u6805\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u6E05\u7406\u4E2D",
      "pending": true,
      "abnormal": true,
      "\u6805\u4F53\u7F16\u53F7": "TRAS-0002",
      "\u6240\u5C5E\u673A\u7EC4": "\u62E6\u6C61\u6805\u6837\u4F8B2",
      "\u524D\u540E\u538B\u5DEE": "\u62E6\u6C61\u6805\u6837\u4F8B2",
      "\u6E05\u6C61\u6B21\u6570": "\u62E6\u6C61\u6805\u6837\u4F8B2",
      "\u6E05\u6C61\u65B9\u5F0F": "\u62E6\u6C61\u6805\u6837\u4F8B2",
      "\u6E05\u7406\u65E5\u671F": "2026-09-02",
      "\u6E05\u7406\u4EBA\u5458": "\u62E6\u6C61\u6805\u6837\u4F8B2",
      "\u6805\u4F53\u72B6\u6001": "\u62E6\u6C61\u6805\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u5DF2\u6E05\u7406",
      "pending": false,
      "abnormal": false,
      "\u6805\u4F53\u7F16\u53F7": "TRAS-0003",
      "\u6240\u5C5E\u673A\u7EC4": "\u62E6\u6C61\u6805\u6837\u4F8B3",
      "\u524D\u540E\u538B\u5DEE": "\u62E6\u6C61\u6805\u6837\u4F8B3",
      "\u6E05\u6C61\u6B21\u6570": "\u62E6\u6C61\u6805\u6837\u4F8B3",
      "\u6E05\u6C61\u65B9\u5F0F": "\u62E6\u6C61\u6805\u6837\u4F8B3",
      "\u6E05\u7406\u65E5\u671F": "2026-09-03",
      "\u6E05\u7406\u4EBA\u5458": "\u62E6\u6C61\u6805\u6837\u4F8B3",
      "\u6805\u4F53\u72B6\u6001": "\u62E6\u6C61\u6805\u6837\u4F8B3"
    }
  ],
  "overhaul": [
    {
      "id": 1,
      "status": "\u5F85\u5BA1\u6279",
      "pending": true,
      "abnormal": false,
      "\u5DE5\u4F5C\u7968\u53F7": "WO-2026-1001",
      "\u5173\u8054\u673A\u7EC4": "UNIT-0004",
      "\u68C0\u4FEE\u7EA7\u522B": "C\u7EA7\u68C0\u4FEE",
      "\u8BA1\u5212\u5DE5\u671F": "3\u5929",
      "\u5B9E\u9645\u5DE5\u671F": "",
      "\u5DE5\u4F5C\u8D1F\u8D23\u4EBA": "\u674E\u5DE5",
      "\u9A8C\u6536\u4EBA\u5458": "",
      "\u68C0\u4FEE\u72B6\u6001": "\u5F85\u5BA1\u6279",
      "\u53F0\u8D26": [
        { "from": "\u2014", "to": "\u5F85\u5BA1\u6279", "action": "\u767B\u8BB0\u68C0\u4FEE\u7968", "at": "2026-10-05T03:15:00", "source": "\u64AD\u79CD\u6570\u636E", "note": "\u673A\u7EC4\u767B\u8BB0\u6545\u969C\u8054\u52A8\u5F00\u7968\uFF0C\u9700\u68C0\u4FEE\u95ED\u73AF\u540E\u673A\u7EC4\u65B9\u53EF\u56DE\u505C\u673A\u5907\u7528" }
      ]
    },
    {
      "id": 2,
      "status": "\u5DF2\u6279\u51C6",
      "pending": true,
      "abnormal": false,
      "\u5DE5\u4F5C\u7968\u53F7": "WO-2026-0998",
      "\u5173\u8054\u673A\u7EC4": "UNIT-0003",
      "\u68C0\u4FEE\u7EA7\u522B": "D\u7EA7\u68C0\u4FEE",
      "\u8BA1\u5212\u5DE5\u671F": "1\u5929",
      "\u5B9E\u9645\u5DE5\u671F": "",
      "\u5DE5\u4F5C\u8D1F\u8D23\u4EBA": "\u738B\u5DE5",
      "\u9A8C\u6536\u4EBA\u5458": "",
      "\u68C0\u4FEE\u72B6\u6001": "\u5DF2\u6279\u51C6",
      "\u53F0\u8D26": [
        { "from": "\u2014", "to": "\u5F85\u5BA1\u6279", "action": "\u767B\u8BB0\u68C0\u4FEE\u7968", "at": "2026-10-02T09:00:00", "source": "\u64AD\u79CD\u6570\u636E" },
        { "from": "\u5F85\u5BA1\u6279", "to": "\u5DF2\u6279\u51C6", "action": "\u63D0\u4EA4\u5BA1\u6279", "at": "2026-10-02T10:00:00", "source": "\u64AD\u79CD\u6570\u636E" }
      ]
    },
    {
      "id": 3,
      "status": "\u5DF2\u5B8C\u5DE5",
      "pending": false,
      "abnormal": false,
      "\u5DE5\u4F5C\u7968\u53F7": "WO-2026-0990",
      "\u5173\u8054\u673A\u7EC4": "UNIT-0002",
      "\u68C0\u4FEE\u7EA7\u522B": "D\u7EA7\u68C0\u4FEE",
      "\u8BA1\u5212\u5DE5\u671F": "1\u5929",
      "\u5B9E\u9645\u5DE5\u671F": "1\u5929",
      "\u5DE5\u4F5C\u8D1F\u8D23\u4EBA": "\u8D75\u5DE5",
      "\u9A8C\u6536\u4EBA\u5458": "\u9648\u5DE5",
      "\u68C0\u4FEE\u72B6\u6001": "\u5DF2\u5B8C\u5DE5",
      "\u53F0\u8D26": [
        { "from": "\u5F85\u5BA1\u6279", "to": "\u5DF2\u6279\u51C6", "action": "\u63D0\u4EA4\u5BA1\u6279", "at": "2026-09-28T09:00:00", "source": "\u64AD\u79CD\u6570\u636E" },
        { "from": "\u5DF2\u6279\u51C6", "to": "\u68C0\u4FEE\u4E2D", "action": "\u5F00\u5DE5\u68C0\u4FEE", "at": "2026-09-29T08:30:00", "source": "\u64AD\u79CD\u6570\u636E" },
        { "from": "\u68C0\u4FEE\u4E2D", "to": "\u5DF2\u5B8C\u5DE5", "action": "\u529E\u7406\u5B8C\u5DE5", "at": "2026-09-30T17:00:00", "source": "\u64AD\u79CD\u6570\u636E" }
      ]
    }
  ],
  "bearing": [
    {
      "id": 1,
      "status": "\u6B63\u5E38",
      "pending": true,
      "abnormal": false,
      "\u8F74\u627F\u7F16\u53F7": "BEAR-0001",
      "\u6240\u5C5E\u673A\u7EC4": "\u5BFC\u8F74\u627F\u6837\u4F8B1",
      "\u4E0A\u5BFC\u6E29\u5EA6": "\u5BFC\u8F74\u627F\u6837\u4F8B1",
      "\u4E0B\u5BFC\u6E29\u5EA6": "\u5BFC\u8F74\u627F\u6837\u4F8B1",
      "\u6CB9\u4F4D\u9AD8\u5EA6": "\u5BFC\u8F74\u627F\u6837\u4F8B1",
      "\u632F\u52A8\u6570\u503C": "\u5BFC\u8F74\u627F\u6837\u4F8B1",
      "\u68C0\u6D4B\u65E5\u671F": "2026-09-01",
      "\u8F74\u627F\u72B6\u6001": "\u5BFC\u8F74\u627F\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u6E29\u5EA6\u504F\u9AD8",
      "pending": true,
      "abnormal": true,
      "\u8F74\u627F\u7F16\u53F7": "BEAR-0002",
      "\u6240\u5C5E\u673A\u7EC4": "\u5BFC\u8F74\u627F\u6837\u4F8B2",
      "\u4E0A\u5BFC\u6E29\u5EA6": "\u5BFC\u8F74\u627F\u6837\u4F8B2",
      "\u4E0B\u5BFC\u6E29\u5EA6": "\u5BFC\u8F74\u627F\u6837\u4F8B2",
      "\u6CB9\u4F4D\u9AD8\u5EA6": "\u5BFC\u8F74\u627F\u6837\u4F8B2",
      "\u632F\u52A8\u6570\u503C": "\u5BFC\u8F74\u627F\u6837\u4F8B2",
      "\u68C0\u6D4B\u65E5\u671F": "2026-09-02",
      "\u8F74\u627F\u72B6\u6001": "\u5BFC\u8F74\u627F\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u5F85\u68C0\u4FEE",
      "pending": false,
      "abnormal": false,
      "\u8F74\u627F\u7F16\u53F7": "BEAR-0003",
      "\u6240\u5C5E\u673A\u7EC4": "\u5BFC\u8F74\u627F\u6837\u4F8B3",
      "\u4E0A\u5BFC\u6E29\u5EA6": "\u5BFC\u8F74\u627F\u6837\u4F8B3",
      "\u4E0B\u5BFC\u6E29\u5EA6": "\u5BFC\u8F74\u627F\u6837\u4F8B3",
      "\u6CB9\u4F4D\u9AD8\u5EA6": "\u5BFC\u8F74\u627F\u6837\u4F8B3",
      "\u632F\u52A8\u6570\u503C": "\u5BFC\u8F74\u627F\u6837\u4F8B3",
      "\u68C0\u6D4B\u65E5\u671F": "2026-09-03",
      "\u8F74\u627F\u72B6\u6001": "\u5BFC\u8F74\u627F\u6837\u4F8B3"
    }
  ],
  "cooling": [
    {
      "id": 1,
      "status": "\u5F85\u68C0\u67E5",
      "pending": true,
      "abnormal": false,
      "\u7CFB\u7EDF\u7F16\u53F7": "COOL-0001",
      "\u4F9B\u6C34\u7C7B\u578B": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B1",
      "\u4F9B\u6C34\u538B\u529B": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B1",
      "\u4F9B\u6C34\u6D41\u91CF": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B1",
      "\u6C34\u6E29\u6570\u503C": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B1",
      "\u6EE4\u6C34\u5668\u538B\u5DEE": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B1",
      "\u68C0\u67E5\u65E5\u671F": "2026-09-01",
      "\u7CFB\u7EDF\u72B6\u6001": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u8FD0\u884C\u4E2D",
      "pending": true,
      "abnormal": true,
      "\u7CFB\u7EDF\u7F16\u53F7": "COOL-0002",
      "\u4F9B\u6C34\u7C7B\u578B": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B2",
      "\u4F9B\u6C34\u538B\u529B": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B2",
      "\u4F9B\u6C34\u6D41\u91CF": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B2",
      "\u6C34\u6E29\u6570\u503C": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B2",
      "\u6EE4\u6C34\u5668\u538B\u5DEE": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B2",
      "\u68C0\u67E5\u65E5\u671F": "2026-09-02",
      "\u7CFB\u7EDF\u72B6\u6001": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u5F02\u5E38",
      "pending": false,
      "abnormal": false,
      "\u7CFB\u7EDF\u7F16\u53F7": "COOL-0003",
      "\u4F9B\u6C34\u7C7B\u578B": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B3",
      "\u4F9B\u6C34\u538B\u529B": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B3",
      "\u4F9B\u6C34\u6D41\u91CF": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B3",
      "\u6C34\u6E29\u6570\u503C": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B3",
      "\u6EE4\u6C34\u5668\u538B\u5DEE": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B3",
      "\u68C0\u67E5\u65E5\u671F": "2026-09-03",
      "\u7CFB\u7EDF\u72B6\u6001": "\u6280\u672F\u4F9B\u6C34\u6837\u4F8B3"
    }
  ],
  "hydrology": [
    {
      "id": 1,
      "status": "\u5F85\u89C2\u6D4B",
      "pending": true,
      "abnormal": false,
      "\u8BB0\u5F55\u7F16\u53F7": "HYDR-0001",
      "\u89C2\u6D4B\u65F6\u95F4": "2026-09-01",
      "\u4E0A\u6E38\u6C34\u4F4D": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B1",
      "\u4E0B\u6E38\u6C34\u4F4D": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B1",
      "\u5165\u5E93\u6D41\u91CF": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B1",
      "\u51FA\u5E93\u6D41\u91CF": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B1",
      "\u503C\u5B88\u4EBA\u5458": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B1",
      "\u8C03\u5EA6\u72B6\u6001": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u5DF2\u89C2\u6D4B",
      "pending": true,
      "abnormal": true,
      "\u8BB0\u5F55\u7F16\u53F7": "HYDR-0002",
      "\u89C2\u6D4B\u65F6\u95F4": "2026-09-02",
      "\u4E0A\u6E38\u6C34\u4F4D": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B2",
      "\u4E0B\u6E38\u6C34\u4F4D": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B2",
      "\u5165\u5E93\u6D41\u91CF": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B2",
      "\u51FA\u5E93\u6D41\u91CF": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B2",
      "\u503C\u5B88\u4EBA\u5458": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B2",
      "\u8C03\u5EA6\u72B6\u6001": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u5DF2\u8C03\u5EA6",
      "pending": false,
      "abnormal": false,
      "\u8BB0\u5F55\u7F16\u53F7": "HYDR-0003",
      "\u89C2\u6D4B\u65F6\u95F4": "2026-09-03",
      "\u4E0A\u6E38\u6C34\u4F4D": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B3",
      "\u4E0B\u6E38\u6C34\u4F4D": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B3",
      "\u5165\u5E93\u6D41\u91CF": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B3",
      "\u51FA\u5E93\u6D41\u91CF": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B3",
      "\u503C\u5B88\u4EBA\u5458": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B3",
      "\u8C03\u5EA6\u72B6\u6001": "\u6C34\u60C5\u8C03\u5EA6\u6837\u4F8B3"
    }
  ],
  "flood": [
    {
      "id": 1,
      "status": "\u5F85\u5BA1\u6279",
      "pending": true,
      "abnormal": false,
      "\u64CD\u4F5C\u7F16\u53F7": "FLOO-0001",
      "\u6CC4\u6D2A\u95F8\u53F7": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B1",
      "\u5F00\u542F\u5B54\u6570": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B1",
      "\u6CC4\u6D2A\u6D41\u91CF": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B1",
      "\u4E0B\u6E38\u9884\u8B66": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B1",
      "\u64CD\u4F5C\u65F6\u95F4": "2026-09-01",
      "\u64CD\u4F5C\u4EBA\u5458": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B1",
      "\u64CD\u4F5C\u72B6\u6001": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u5DF2\u6279\u51C6",
      "pending": true,
      "abnormal": true,
      "\u64CD\u4F5C\u7F16\u53F7": "FLOO-0002",
      "\u6CC4\u6D2A\u95F8\u53F7": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B2",
      "\u5F00\u542F\u5B54\u6570": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B2",
      "\u6CC4\u6D2A\u6D41\u91CF": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B2",
      "\u4E0B\u6E38\u9884\u8B66": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B2",
      "\u64CD\u4F5C\u65F6\u95F4": "2026-09-02",
      "\u64CD\u4F5C\u4EBA\u5458": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B2",
      "\u64CD\u4F5C\u72B6\u6001": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u6CC4\u6D2A\u4E2D",
      "pending": false,
      "abnormal": false,
      "\u64CD\u4F5C\u7F16\u53F7": "FLOO-0003",
      "\u6CC4\u6D2A\u95F8\u53F7": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B3",
      "\u5F00\u542F\u5B54\u6570": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B3",
      "\u6CC4\u6D2A\u6D41\u91CF": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B3",
      "\u4E0B\u6E38\u9884\u8B66": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B3",
      "\u64CD\u4F5C\u65F6\u95F4": "2026-09-03",
      "\u64CD\u4F5C\u4EBA\u5458": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B3",
      "\u64CD\u4F5C\u72B6\u6001": "\u6CC4\u6D2A\u64CD\u4F5C\u6837\u4F8B3"
    }
  ],
  "generation": [
    {
      "id": 1,
      "status": "\u5F85\u7F16\u5236",
      "pending": true,
      "abnormal": false,
      "\u8BA1\u5212\u7F16\u53F7": "GENE-20261005",
      "\u8BA1\u5212\u65E5\u671F": "2026-10-05",
      "\u8BA1\u5212\u51FA\u529B": 200,
      "\u5B9E\u9645\u51FA\u529B": 0,
      "\u65E5\u53D1\u7535\u91CF": 0,
      "\u4E0A\u7F51\u7535\u91CF": 0,
      "\u5B8C\u6210\u6BD4\u7387": "0%",
      "\u8BA1\u5212\u72B6\u6001": "\u5F85\u7F16\u5236"
    },
    {
      "id": 2,
      "status": "\u6267\u884C\u4E2D",
      "pending": true,
      "abnormal": false,
      "\u8BA1\u5212\u7F16\u53F7": "GENE-20261004",
      "\u8BA1\u5212\u65E5\u671F": "2026-10-04",
      "\u8BA1\u5212\u51FA\u529B": 180,
      "\u5B9E\u9645\u51FA\u529B": 172,
      "\u65E5\u53D1\u7535\u91CF": 3100,
      "\u4E0A\u7F51\u7535\u91CF": 3050,
      "\u5B8C\u6210\u6BD4\u7387": "96%",
      "\u8BA1\u5212\u72B6\u6001": "\u6267\u884C\u4E2D"
    },
    {
      "id": 3,
      "status": "\u5DF2\u5B8C\u6210",
      "pending": false,
      "abnormal": false,
      "\u8BA1\u5212\u7F16\u53F7": "GENE-20261003",
      "\u8BA1\u5212\u65E5\u671F": "2026-10-03",
      "\u8BA1\u5212\u51FA\u529B": 160,
      "\u5B9E\u9645\u51FA\u529B": 158,
      "\u65E5\u53D1\u7535\u91CF": 2900,
      "\u4E0A\u7F51\u7535\u91CF": 2860,
      "\u5B8C\u6210\u6BD4\u7387": "99%",
      "\u8BA1\u5212\u72B6\u6001": "\u5DF2\u5B8C\u6210"
    }
  ],
  "protection": [
    {
      "id": 1,
      "status": "\u5F85\u6821\u9A8C",
      "pending": true,
      "abnormal": false,
      "\u88C5\u7F6E\u7F16\u53F7": "PROT-0001",
      "\u4FDD\u62A4\u7C7B\u578B": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B1",
      "\u5B9A\u503C\u5355\u53F7": "PROT-0001",
      "\u4E0A\u6B21\u6821\u9A8C\u65E5": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B1",
      "\u4E0B\u6B21\u6821\u9A8C\u65E5": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B1",
      "\u52A8\u4F5C\u6B21\u6570": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B1",
      "\u6821\u9A8C\u4EBA\u5458": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B1",
      "\u88C5\u7F6E\u72B6\u6001": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u6B63\u5E38",
      "pending": true,
      "abnormal": true,
      "\u88C5\u7F6E\u7F16\u53F7": "PROT-0002",
      "\u4FDD\u62A4\u7C7B\u578B": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B2",
      "\u5B9A\u503C\u5355\u53F7": "PROT-0002",
      "\u4E0A\u6B21\u6821\u9A8C\u65E5": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B2",
      "\u4E0B\u6B21\u6821\u9A8C\u65E5": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B2",
      "\u52A8\u4F5C\u6B21\u6570": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B2",
      "\u6821\u9A8C\u4EBA\u5458": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B2",
      "\u88C5\u7F6E\u72B6\u6001": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u5F02\u5E38",
      "pending": false,
      "abnormal": false,
      "\u88C5\u7F6E\u7F16\u53F7": "PROT-0003",
      "\u4FDD\u62A4\u7C7B\u578B": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B3",
      "\u5B9A\u503C\u5355\u53F7": "PROT-0003",
      "\u4E0A\u6B21\u6821\u9A8C\u65E5": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B3",
      "\u4E0B\u6B21\u6821\u9A8C\u65E5": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B3",
      "\u52A8\u4F5C\u6B21\u6570": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B3",
      "\u6821\u9A8C\u4EBA\u5458": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B3",
      "\u88C5\u7F6E\u72B6\u6001": "\u7EE7\u7535\u4FDD\u62A4\u6837\u4F8B3"
    }
  ],
  "defect": [
    {
      "id": 1,
      "status": "\u5F85\u5904\u7406",
      "pending": true,
      "abnormal": false,
      "\u7F3A\u9677\u7F16\u53F7": "DEFE-2026-0101",
      "\u8BBE\u5907\u540D\u79F0": "UNIT-0004 \u6C34\u8F6E\u53D1\u7535\u673A\u7EC4",
      "\u7F3A\u9677\u63CF\u8FF0": "\u673A\u7EC4\u632F\u52A8\u8D8A\u9650\uFF0C\u4FDD\u62A4\u8DF3\u95F8\u505C\u673A",
      "\u7F3A\u9677\u7B49\u7EA7": "\u7D27\u6025",
      "\u53D1\u73B0\u65E5\u671F": "2026-10-05",
      "\u5904\u7406\u671F\u9650": "2026-10-06",
      "\u5904\u7406\u4EBA\u5458": "",
      "\u6765\u6E90": "\u6545\u969C\u8054\u52A8",
      "\u53F0\u8D26": [
        { "from": "\u2014", "to": "\u5F85\u5904\u7406", "action": "\u767B\u8BB0\u6545\u969C\u8054\u52A8", "at": "2026-10-05T03:10:00", "source": "\u6545\u969C\u8054\u52A8", "note": "\u673A\u7EC4 UNIT-0004 \u767B\u8BB0\u6545\u969C\u65F6\u81EA\u52A8\u767B\u8BB0" }
      ]
    },
    {
      "id": 2,
      "status": "\u5904\u7406\u4E2D",
      "pending": true,
      "abnormal": false,
      "\u7F3A\u9677\u7F16\u53F7": "DEFE-2026-0098",
      "\u8BBE\u5907\u540D\u79F0": "UNIT-0002 \u8C03\u901F\u5668",
      "\u7F3A\u9677\u63CF\u8FF0": "\u8C03\u901F\u5668\u6CB9\u538B\u6CE2\u52A8\u504F\u5927",
      "\u7F3A\u9677\u7B49\u7EA7": "\u4E00\u822C",
      "\u53D1\u73B0\u65E5\u671F": "2026-10-03",
      "\u5904\u7406\u671F\u9650": "2026-10-08",
      "\u5904\u7406\u4EBA\u5458": "\u8D75\u5DE5",
      "\u6765\u6E90": "\u4EBA\u5DE5\u767B\u8BB0",
      "\u53F0\u8D26": [
        { "from": "\u2014", "to": "\u5F85\u5904\u7406", "action": "\u4EBA\u5DE5\u767B\u8BB0", "at": "2026-10-03T09:00:00", "source": "\u4EBA\u5DE5\u767B\u8BB0" },
        { "from": "\u5F85\u5904\u7406", "to": "\u5904\u7406\u4E2D", "action": "\u6D3E\u53D1\u5904\u7406", "at": "2026-10-03T10:30:00", "source": "\u4EBA\u5DE5\u767B\u8BB0" }
      ]
    },
    {
      "id": 3,
      "status": "\u5DF2\u5F52\u6863",
      "pending": false,
      "abnormal": false,
      "\u7F3A\u9677\u7F16\u53F7": "DEFE-2026-0087",
      "\u8BBE\u5907\u540D\u79F0": "UNIT-0001 \u6280\u672F\u4F9B\u6C34\u7CFB\u7EDF",
      "\u7F3A\u9677\u63CF\u8FF0": "\u6EE4\u6C34\u5668\u538B\u5DEE\u504F\u9AD8\uFF0C\u5DF2\u6E05\u7406",
      "\u7F3A\u9677\u7B49\u7EA7": "\u91CD\u5927",
      "\u53D1\u73B0\u65E5\u671F": "2026-09-26",
      "\u5904\u7406\u671F\u9650": "2026-09-30",
      "\u5904\u7406\u4EBA\u5458": "\u674E\u5DE5",
      "\u6765\u6E90": "\u4EBA\u5DE5\u767B\u8BB0",
      "\u53F0\u8D26": [
        { "from": "\u5F85\u5904\u7406", "to": "\u5904\u7406\u4E2D", "action": "\u6D3E\u53D1\u5904\u7406", "at": "2026-09-26T14:00:00", "source": "\u4EBA\u5DE5\u767B\u8BB0" },
        { "from": "\u5904\u7406\u4E2D", "to": "\u5DF2\u5B8C\u6210", "action": "\u786E\u8BA4\u6D88\u9664", "at": "2026-09-27T16:00:00", "source": "\u4EBA\u5DE5\u767B\u8BB0" },
        { "from": "\u5DF2\u5B8C\u6210", "to": "\u5DF2\u5F52\u6863", "action": "\u5F52\u6863", "at": "2026-09-28T09:00:00", "source": "\u4EBA\u5DE5\u767B\u8BB0" }
      ]
    }
  ],
  "crew": [
    {
      "id": 1,
      "status": "\u5F85\u8FDB\u573A",
      "pending": true,
      "abnormal": false,
      "\u4EBA\u5458\u7F16\u53F7": "CREW-0001",
      "\u59D3\u540D": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B1",
      "\u5C97\u4F4D": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B1",
      "\u6301\u8BC1\u7C7B\u578B": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B1",
      "\u8BC1\u4E66\u6709\u6548\u671F": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B1",
      "\u6240\u5C5E\u73ED\u7EC4": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B1",
      "\u8054\u7CFB\u7535\u8BDD": "13800000001",
      "\u5728\u573A\u72B6\u6001": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B1"
    },
    {
      "id": 2,
      "status": "\u5728\u573A",
      "pending": true,
      "abnormal": true,
      "\u4EBA\u5458\u7F16\u53F7": "CREW-0002",
      "\u59D3\u540D": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B2",
      "\u5C97\u4F4D": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B2",
      "\u6301\u8BC1\u7C7B\u578B": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B2",
      "\u8BC1\u4E66\u6709\u6548\u671F": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B2",
      "\u6240\u5C5E\u73ED\u7EC4": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B2",
      "\u8054\u7CFB\u7535\u8BDD": "13800000002",
      "\u5728\u573A\u72B6\u6001": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B2"
    },
    {
      "id": 3,
      "status": "\u5DF2\u79BB\u573A",
      "pending": false,
      "abnormal": false,
      "\u4EBA\u5458\u7F16\u53F7": "CREW-0003",
      "\u59D3\u540D": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B3",
      "\u5C97\u4F4D": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B3",
      "\u6301\u8BC1\u7C7B\u578B": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B3",
      "\u8BC1\u4E66\u6709\u6548\u671F": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B3",
      "\u6240\u5C5E\u73ED\u7EC4": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B3",
      "\u8054\u7CFB\u7535\u8BDD": "13800000003",
      "\u5728\u573A\u72B6\u6001": "\u68C0\u4FEE\u4EBA\u5458\u6837\u4F8B3"
    }
  ],
  "spare": [
    {
      "id": 1,
      "status": "\u5F85\u9A8C\u6536",
      "pending": true,
      "abnormal": false,
      "\u5907\u4EF6\u7F16\u53F7": "SPAR-0001",
      "\u5907\u4EF6\u540D\u79F0": "\u8C03\u901F\u5668\u6DB2\u538B\u6CB9\u6CF5",
      "\u89C4\u683C\u578B\u53F7": "HY-PUMP-25",
      "\u9002\u7528\u8BBE\u5907": "\u8C03\u901F\u5668",
      "\u5B58\u653E\u4F4D\u7F6E": "\u5907\u54C1\u5E93A-01",
      "\u73B0\u6709\u6570\u91CF": 10,
      "\u6700\u4F4E\u50A8\u5907\u91CF": 2,
      "\u7D2F\u8BA1\u9886\u7528": 0
    },
    {
      "id": 2,
      "status": "\u5DF2\u767B\u8BB0",
      "pending": true,
      "abnormal": false,
      "\u5907\u4EF6\u7F16\u53F7": "SPAR-0002",
      "\u5907\u4EF6\u540D\u79F0": "\u52B1\u78C1\u529F\u7387\u67DC\u98CE\u673A",
      "\u89C4\u683C\u578B\u53F7": "FAN-120",
      "\u9002\u7528\u8BBE\u5907": "\u52B1\u78C1\u7CFB\u7EDF",
      "\u5B58\u653E\u4F4D\u7F6E": "\u5907\u54C1\u5E93A-02",
      "\u73B0\u6709\u6570\u91CF": 20,
      "\u6700\u4F4E\u50A8\u5907\u91CF": 4,
      "\u7D2F\u8BA1\u9886\u7528": 3
    },
    {
      "id": 3,
      "status": "\u5DF2\u9886\u7528",
      "pending": false,
      "abnormal": false,
      "\u5907\u4EF6\u7F16\u53F7": "SPAR-0003",
      "\u5907\u4EF6\u540D\u79F0": "\u4E3B\u8F74\u5BC6\u5C01\u4EF6",
      "\u89C4\u683C\u578B\u53F7": "SEAL-450",
      "\u9002\u7528\u8BBE\u5907": "\u6C34\u8F6E\u53D1\u7535\u673A\u7EC4",
      "\u5B58\u653E\u4F4D\u7F6E": "\u5907\u54C1\u5E93B-01",
      "\u73B0\u6709\u6570\u91CF": 5,
      "\u6700\u4F4E\u50A8\u5907\u91CF": 6,
      "\u7D2F\u8BA1\u9886\u7528": 1
    }
  ]
};

// src/domain/clock.ts
function nowIso() {
  return (/* @__PURE__ */ new Date()).toISOString().replace(/\.\d{3}Z$/, "Z");
}
function pad(value) {
  return String(value).padStart(2, "0");
}
function formatDateTime(iso) {
  if (!iso) {
    return "\u2014";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
function formatDate(iso) {
  return formatDateTime(iso).slice(0, 10);
}
function hoursBetween(fromIso, toIso) {
  if (!fromIso || !toIso) {
    return 0;
  }
  const from = new Date(fromIso).getTime();
  const to = new Date(toIso).getTime();
  if (Number.isNaN(from) || Number.isNaN(to) || to <= from) {
    return 0;
  }
  return Math.round((to - from) / 36e5 * 100) / 100;
}
function toNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

// src/domain/ledger.ts
function ledgerOf(row2) {
  const events = row2["\u53F0\u8D26"];
  return Array.isArray(events) ? events : [];
}
function appendLedger(row2, event, at) {
  const events = ledgerOf(row2);
  events.push({
    from: event.from,
    to: event.to,
    action: event.action,
    source: event.source,
    note: event.note,
    at: event.at ?? at
  });
  events.sort((a, b) => a.at.localeCompare(b.at));
  row2["\u53F0\u8D26"] = events;
}

// src/data/local-store.ts
var STORAGE_KEY = "hydropower-plant-om:entries";
var STORE_VERSION = 2;
var MIGRATION_BASE = "2026-10-05T00:00:00";
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
function freshStore() {
  return { version: STORE_VERSION, rows: clone(SEED_ROWS) };
}
function numericOrZero(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value.trim()))) {
    return Number(value.trim());
  }
  return 0;
}
var UNIT_NUMERIC_FIELDS = ["\u989D\u5B9A\u8F6C\u901F", "\u6709\u529F\u51FA\u529B", "\u65E0\u529F\u51FA\u529B", "\u7D2F\u8BA1\u8FD0\u884C\u5C0F\u65F6", "\u632F\u52A8\u6570\u503C"];
function migrateUnitRow(row2, at) {
  for (const field of UNIT_NUMERIC_FIELDS) {
    row2[field] = numericOrZero(row2[field]);
  }
  if (!Array.isArray(row2["\u53F0\u8D26"])) {
    row2["\u53F0\u8D26"] = [];
  }
  const ledger2 = row2["\u53F0\u8D26"];
  if (ledger2.length === 0) {
    const backfill = (event) => appendLedger(row2, event, at);
    if (row2.status === "\u8FD0\u884C\u4E2D") {
      row2["\u5E76\u7F51\u65F6\u523B"] = row2["\u5E76\u7F51\u65F6\u523B"] || MIGRATION_BASE;
      row2["\u505C\u673A\u65F6\u523B"] = "";
      backfill({
        from: "\u5F85\u542F\u52A8",
        to: "\u8FD0\u884C\u4E2D",
        action: "\u5F00\u673A\u5E76\u7F51",
        at: MIGRATION_BASE,
        source: "\u8FC1\u79FB\u8865\u5F55",
        note: "\u65E9\u671F\u6570\u636E\u53EA\u8BB0\u5F55\u8FD0\u884C\u72B6\u6001\uFF0C\u5E76\u7F51\u65F6\u523B\u6309\u8FC1\u79FB\u57FA\u51C6\u65E5 2026-10-05 00:00 \u56DE\u586B\uFF0C\u7D2F\u8BA1\u8FD0\u884C\u5C0F\u65F6\u4FDD\u7559\u539F\u767B\u8BB0\u503C"
      });
    } else if (row2.status === "\u505C\u673A\u5907\u7528") {
      row2["\u5E76\u7F51\u65F6\u523B"] = "";
      row2["\u505C\u673A\u65F6\u523B"] = row2["\u505C\u673A\u65F6\u523B"] || MIGRATION_BASE;
      backfill({
        from: "\u8FD0\u884C\u4E2D",
        to: "\u505C\u673A\u5907\u7528",
        action: "\u505C\u673A\u8F6C\u5907",
        at: MIGRATION_BASE,
        source: "\u8FC1\u79FB\u8865\u5F55",
        note: "\u8D77\u505C\u65F6\u523B\u7F3A\u9879\uFF0C\u6309\u8FC1\u79FB\u57FA\u51C6\u65E5\u56DE\u586B\u4E3A\u505C\u673A\u65F6\u523B"
      });
    } else if (row2.status === "\u5F85\u542F\u52A8") {
      row2["\u5E76\u7F51\u65F6\u523B"] = "";
      row2["\u505C\u673A\u65F6\u523B"] = row2["\u505C\u673A\u65F6\u523B"] || MIGRATION_BASE;
      backfill({
        from: "\u505C\u673A\u5907\u7528",
        to: "\u5F85\u542F\u52A8",
        action: "\u6062\u590D\u5F85\u542F\u52A8",
        at: MIGRATION_BASE,
        source: "\u8FC1\u79FB\u8865\u5F55",
        note: "\u8D77\u505C\u65F6\u523B\u7F3A\u9879\uFF0C\u6309\u8FC1\u79FB\u57FA\u51C6\u65E5\u56DE\u586B"
      });
    } else if (row2.status === "\u6545\u969C\u505C\u673A") {
      row2["\u5E76\u7F51\u65F6\u523B"] = "";
      row2["\u505C\u673A\u65F6\u523B"] = row2["\u505C\u673A\u65F6\u523B"] || MIGRATION_BASE;
      backfill({
        from: "\u8FD0\u884C\u4E2D",
        to: "\u6545\u969C\u505C\u673A",
        action: "\u767B\u8BB0\u6545\u969C",
        at: MIGRATION_BASE,
        source: "\u8FC1\u79FB\u8865\u5F55",
        note: "\u6545\u969C\u65F6\u523B\u7F3A\u9879\uFF0C\u6309\u8FC1\u79FB\u57FA\u51C6\u65E5\u56DE\u586B\uFF1B\u56DE\u505C\u673A\u5907\u7528\u524D\u5FC5\u987B\u5148\u5B8C\u6210\u68C0\u4FEE\u95ED\u73AF"
      });
    }
  }
}
function migrateDefectRow(row2, at) {
  let legacyStatus = "";
  if (row2.status === "\u5DF2\u6D88\u9664") {
    legacyStatus = row2.status;
    row2.status = "\u5DF2\u5B8C\u6210";
  } else if (row2.status === "\u5DF2\u6302\u8D26") {
    legacyStatus = row2.status;
    row2.status = "\u5904\u7406\u4E2D";
  }
  if (row2["\u6765\u6E90"] === void 0) {
    row2["\u6765\u6E90"] = legacyStatus ? `\u8FC1\u79FB\u8865\u5F55\uFF08\u539F\u72B6\u6001\uFF1A${legacyStatus}\uFF09` : "\u8FC1\u79FB\u8865\u5F55";
  }
  if (!Array.isArray(row2["\u53F0\u8D26"])) {
    const note = legacyStatus ? `\u5386\u53F2\u53F0\u8D26\u7F3A\u9879\uFF0C\u539F\u767B\u8BB0\u72B6\u6001\u4E3A\u300C${legacyStatus}\u300D\uFF0C\u6309\u517C\u5BB9\u89C4\u5219\u6620\u5C04\u4E3A\u300C${row2.status}\u300D\uFF1B\u7F3A\u9677\u7B49\u7EA7\u4FDD\u7559\u539F\u503C\u4E0D\u6539\u5199` : "\u5386\u53F2\u53F0\u8D26\u7F3A\u9879\uFF0C\u6309\u53D1\u73B0\u65E5\u671F\u56DE\u586B\u767B\u8BB0\u4E8B\u4EF6";
    appendLedger(
      row2,
      {
        from: "\u2014",
        to: row2.status,
        action: "\u8FC1\u79FB\u8865\u5F55",
        at: `${String(row2["\u53D1\u73B0\u65E5\u671F"] ?? "").slice(0, 10) || MIGRATION_BASE.slice(0, 10)}T00:00:00`,
        source: "\u8FC1\u79FB\u8865\u5F55",
        note
      },
      at
    );
  }
}
function migrateOverhaulRow(row2, at) {
  if (row2["\u5173\u8054\u673A\u7EC4"] === void 0) {
    const oldRef = String(row2["\u68C0\u4FEE\u673A\u7EC4"] ?? "");
    row2["\u5173\u8054\u673A\u7EC4"] = /^UNIT-\d{4}$/.test(oldRef) ? oldRef : "";
    delete row2["\u68C0\u4FEE\u673A\u7EC4"];
  }
  if (!Array.isArray(row2["\u53F0\u8D26"])) {
    appendLedger(
      row2,
      {
        from: "\u2014",
        to: row2.status,
        action: "\u8FC1\u79FB\u8865\u5F55",
        at: MIGRATION_BASE,
        source: "\u8FC1\u79FB\u8865\u5F55",
        note: "\u68C0\u4FEE\u7968\u5386\u53F2\u6D41\u7A0B\u7F3A\u9879\uFF0C\u6309\u5F53\u524D\u72B6\u6001\u56DE\u586B\uFF0C\u5173\u8054\u673A\u7EC4\u4E3A\u7A7A\u65F6\u9700\u5148\u8865\u5173\u8054\u624D\u53EF\u5F00\u5DE5"
      },
      at
    );
  }
}
function migrateSpareRow(row2) {
  row2["\u73B0\u6709\u6570\u91CF"] = numericOrZero(row2["\u73B0\u6709\u6570\u91CF"]);
  if (row2["\u7D2F\u8BA1\u9886\u7528"] === void 0) {
    row2["\u7D2F\u8BA1\u9886\u7528"] = row2.status === "\u5DF2\u9886\u7528" ? 1 : 0;
  } else {
    row2["\u7D2F\u8BA1\u9886\u7528"] = numericOrZero(row2["\u7D2F\u8BA1\u9886\u7528"]);
  }
  delete row2["\u5907\u4EF6\u72B6\u6001"];
}
function migrateGenerationRow(row2) {
  for (const field of ["\u8BA1\u5212\u51FA\u529B", "\u5B9E\u9645\u51FA\u529B", "\u65E5\u53D1\u7535\u91CF", "\u4E0A\u7F51\u7535\u91CF"]) {
    row2[field] = numericOrZero(row2[field]);
  }
}
function toStore(raw) {
  if (raw && typeof raw === "object" && !Array.isArray(raw) && !("version" in raw)) {
    const rows = clone(raw);
    migrateV1(rows);
    return { version: STORE_VERSION, rows };
  }
  const parsed = raw;
  if (parsed && typeof parsed === "object" && parsed.rows && typeof parsed.rows === "object") {
    return { version: STORE_VERSION, rows: clone(parsed.rows) };
  }
  return freshStore();
}
function migrateV1(rows) {
  const at = nowIso();
  const overhaulRows = rows["overhaul"] ?? [];
  let ticketId = overhaulRows.reduce((max, row2) => Math.max(max, Number(row2.id) || 0), 0);
  for (const unit of rows["unit"] ?? []) {
    migrateUnitRow(unit, at);
    if (unit.status === "\u6545\u969C\u505C\u673A") {
      const code = String(unit["\u673A\u7EC4\u7F16\u53F7"] ?? "");
      const linked = overhaulRows.some((row2) => String(row2["\u5173\u8054\u673A\u7EC4"] ?? "") === code);
      if (!linked) {
        ticketId += 1;
        const ticket = {
          id: ticketId,
          status: "\u5F85\u5BA1\u6279",
          pending: true,
          abnormal: false,
          \u5DE5\u4F5C\u7968\u53F7: `WO-MIG-${String(ticketId).padStart(4, "0")}`,
          \u5173\u8054\u673A\u7EC4: code,
          \u68C0\u4FEE\u7EA7\u522B: "\u672A\u5206\u7EA7",
          \u8BA1\u5212\u5DE5\u671F: "",
          \u5B9E\u9645\u5DE5\u671F: "",
          \u5DE5\u4F5C\u8D1F\u8D23\u4EBA: "",
          \u9A8C\u6536\u4EBA\u5458: "",
          \u68C0\u4FEE\u72B6\u6001: "\u5F85\u5BA1\u6279",
          \u53F0\u8D26: [
            {
              from: "\u2014",
              to: "\u5F85\u5BA1\u6279",
              action: "\u8FC1\u79FB\u8865\u5F55",
              at: MIGRATION_BASE,
              source: "\u8FC1\u79FB\u8865\u5F55",
              note: "\u8BE5\u673A\u7EC4\u5386\u53F2\u5DF2\u5904\u4E8E\u6545\u969C\u505C\u673A\u4E14\u65E0\u68C0\u4FEE\u7968\uFF0C\u8865\u5F00\u5F85\u5BA1\u6279\u7968\uFF0C\u8D70\u5B8C\u5BA1\u6279-\u5F00\u5DE5-\u5B8C\u5DE5\u95ED\u73AF\u540E\u65B9\u53EF\u56DE\u505C\u673A\u5907\u7528"
            }
          ]
        };
        overhaulRows.push(ticket);
      }
    }
  }
  if (overhaulRows.length) {
    rows["overhaul"] = overhaulRows;
  }
  ;
  (rows["defect"] ?? []).forEach((row2) => migrateDefectRow(row2, at));
  (rows["overhaul"] ?? []).forEach((row2) => migrateOverhaulRow(row2, at));
  (rows["spare"] ?? []).forEach(migrateSpareRow);
  (rows["generation"] ?? []).forEach(migrateGenerationRow);
}
function readStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return freshStore();
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const store2 = freshStore();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store2));
    return store2;
  }
  try {
    const store2 = toStore(JSON.parse(raw));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store2));
    return store2;
  } catch {
    const store2 = freshStore();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store2));
    return store2;
  }
}
var cache = null;
function store() {
  if (cache === null) {
    cache = readStorage();
  }
  return cache;
}
function allRows() {
  return store().rows;
}
function listRows(key) {
  return store().rows[key] ?? [];
}
function saveRows(key, rows) {
  const next = {
    version: STORE_VERSION,
    rows: { ...store().rows, [key]: rows }
  };
  cache = next;
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}
function saveMany(patch) {
  const next = { version: STORE_VERSION, rows: { ...store().rows, ...patch } };
  cache = next;
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
}
function resetRows(key) {
  const rows = clone(SEED_ROWS[key] ?? []);
  saveRows(key, rows);
  return rows;
}

// src/domain/unit.ts
var UNIT_STATUS = {
  READY: "\u5F85\u542F\u52A8",
  RUNNING: "\u8FD0\u884C\u4E2D",
  STANDBY: "\u505C\u673A\u5907\u7528",
  FAULT: "\u6545\u969C\u505C\u673A"
};
var UNIT_ACTION = {
  START: "\u5F00\u673A\u5E76\u7F51",
  STOP: "\u505C\u673A\u8F6C\u5907",
  FAULT: "\u767B\u8BB0\u6545\u969C",
  RESUME: "\u6062\u590D\u5F85\u542F\u52A8"
};
var UNIT_ACTION_GUARD = {
  [UNIT_ACTION.START]: UNIT_STATUS.READY,
  [UNIT_ACTION.STOP]: UNIT_STATUS.RUNNING,
  [UNIT_ACTION.FAULT]: UNIT_STATUS.RUNNING,
  [UNIT_ACTION.RESUME]: UNIT_STATUS.STANDBY
};
function blockedMessage(current, required, action) {
  return `\u300C${action}\u300D\u53EA\u80FD\u4ECE\u300C${required}\u300D\u53D1\u8D77\uFF0C\u673A\u7EC4\u5F53\u524D\u505C\u5728\u300C${current}\u300D\uFF0C\u8BF7\u5148\u63A8\u8FDB\u5230\u300C${required}\u300D`;
}
function runningHours(row2, at) {
  const settled = toNumber(row2["\u7D2F\u8BA1\u8FD0\u884C\u5C0F\u65F6"]);
  if (row2.status !== UNIT_STATUS.RUNNING) {
    return settled;
  }
  return Math.round((settled + hoursBetween(String(row2["\u5E76\u7F51\u65F6\u523B"] ?? ""), at)) * 100) / 100;
}
function unitMetrics(rows, at) {
  const metrics = {
    runningCount: 0,
    adjustableMw: 0,
    standbyMw: 0,
    faultCount: 0,
    maxVibration: 0
  };
  for (const row2 of rows) {
    const output = toNumber(row2["\u6709\u529F\u51FA\u529B"]);
    if (row2.status === UNIT_STATUS.RUNNING) {
      metrics.runningCount += 1;
      metrics.adjustableMw += output;
      metrics.maxVibration = Math.max(metrics.maxVibration, toNumber(row2["\u632F\u52A8\u6570\u503C"]));
    } else if (row2.status === UNIT_STATUS.STANDBY) {
      metrics.adjustableMw += output;
      metrics.standbyMw += output;
    } else if (row2.status === UNIT_STATUS.READY) {
      metrics.adjustableMw += output;
    } else if (row2.status === UNIT_STATUS.FAULT) {
      metrics.faultCount += 1;
    }
  }
  metrics.adjustableMw = Math.round(metrics.adjustableMw * 100) / 100;
  metrics.standbyMw = Math.round(metrics.standbyMw * 100) / 100;
  metrics.maxVibration = Math.round(metrics.maxVibration * 1e3) / 1e3;
  return metrics;
}

// src/domain/overhaul.ts
var OVERHAUL_STATUS = {
  PENDING_APPROVAL: "\u5F85\u5BA1\u6279",
  APPROVED: "\u5DF2\u6279\u51C6",
  REPAIRING: "\u68C0\u4FEE\u4E2D",
  DONE: "\u5DF2\u5B8C\u5DE5"
};
var OVERHAUL_ACTION = {
  SUBMIT: "\u63D0\u4EA4\u5BA1\u6279",
  START: "\u5F00\u5DE5\u68C0\u4FEE",
  FINISH: "\u529E\u7406\u5B8C\u5DE5"
};

// src/domain/defect.ts
var DEFECT_STATUS = {
  PENDING: "\u5F85\u5904\u7406",
  PROCESSING: "\u5904\u7406\u4E2D",
  DONE: "\u5DF2\u5B8C\u6210",
  ARCHIVED: "\u5DF2\u5F52\u6863"
};
var DEFECT_ACTION = {
  DISPATCH: "\u6D3E\u53D1\u5904\u7406",
  RESOLVE: "\u786E\u8BA4\u6D88\u9664",
  ARCHIVE: "\u5F52\u6863"
};
var DEFECT_LEVELS = ["\u4E00\u822C", "\u91CD\u5927", "\u7D27\u6025"];
function findDuplicateDefect(rows, draft) {
  const code = draft.\u7F3A\u9677\u7F16\u53F7?.trim();
  if (code) {
    const byCode = rows.find((row2) => String(row2["\u7F3A\u9677\u7F16\u53F7"] ?? "").trim() === code);
    if (byCode) {
      return byCode;
    }
  }
  return rows.find(
    (row2) => String(row2["\u8BBE\u5907\u540D\u79F0"] ?? "").trim() === draft.\u8BBE\u5907\u540D\u79F0.trim() && String(row2["\u7F3A\u9677\u63CF\u8FF0"] ?? "").trim() === draft.\u7F3A\u9677\u63CF\u8FF0.trim() && String(row2["\u53D1\u73B0\u65E5\u671F"] ?? "").trim() === draft.\u53D1\u73B0\u65E5\u671F.trim()
  );
}

// src/domain/spare.ts
var SPARE_ACTION = {
  ACCEPT: "\u529E\u7406\u9A8C\u6536",
  ISSUE: "\u9886\u7528\u5907\u4EF6",
  REORDER: "\u63D0\u4EA4\u8865\u5145"
};
var ISSUE_QTY = 1;
function issueSpare(row2) {
  const stock = toNumber(row2["\u73B0\u6709\u6570\u91CF"]);
  if (stock < ISSUE_QTY) {
    return { ok: false, message: `\u5907\u4EF6\u5E93\u5B58\u4E3A ${stock}\uFF0C\u4E0D\u8DB3\u4E00\u4EF6\uFF0C\u4E0D\u80FD\u9886\u7528` };
  }
  row2["\u73B0\u6709\u6570\u91CF"] = stock - ISSUE_QTY;
  row2["\u7D2F\u8BA1\u9886\u7528"] = toNumber(row2["\u7D2F\u8BA1\u9886\u7528"]) + ISSUE_QTY;
  return { ok: true, message: "" };
}

// src/api/local-service.ts
var ABNORMAL_WORDS = ["\u5F02\u5E38", "\u544A\u8B66", "\u62A5\u8B66", "\u9884\u8B66", "\u8D85\u9650", "\u6545\u969C", "\u635F\u574F", "\u5F85\u8865\u5145", "\u505C\u5DE5", "\u505C\u8FD0"];
function moduleMeta(key) {
  const meta = MODULE_BY_KEY.get(key);
  if (!meta) {
    throw new Error(`\u6CA1\u6709\u767B\u8BB0\u540D\u4E3A ${key} \u7684\u4E1A\u52A1\u6A21\u5757`);
  }
  return meta;
}
function filterRows(rows, filters) {
  const pairs = Object.entries(filters).filter(([, value]) => value.trim() !== "");
  if (pairs.length === 0) {
    return rows;
  }
  return rows.filter(
    (row2) => pairs.every(([field, value]) => String(row2[field] ?? "").includes(value.trim()))
  );
}
function listEntries(key, filters = {}) {
  const matched = filterRows(listRows(key), filters);
  return { items: matched, total: matched.length, page: 1, size: matched.length };
}
function isPendingStatus(meta, status) {
  const terminals = meta.terminalStatuses ?? [meta.statuses[meta.statuses.length - 1]];
  return !terminals.includes(status);
}
function isAbnormalStatus(meta, status) {
  if (meta.abnormalStatuses) {
    return meta.abnormalStatuses.includes(status);
  }
  return ABNORMAL_WORDS.some((word) => status.includes(word));
}
function guardOrderedStep(meta, row2, action, target) {
  const currentIndex = meta.statuses.indexOf(row2.status);
  const targetIndex = meta.statuses.indexOf(target);
  if (currentIndex < 0) {
    return { ok: false, message: `\u5F53\u524D\u72B6\u6001\u300C${row2.status}\u300D\u4E0D\u5728${meta.name}\u72B6\u6001\u94FE\u4E0A\uFF0C\u65E0\u6CD5\u6267\u884C\u300C${action}\u300D` };
  }
  if (targetIndex < 0) {
    return { ok: false, message: `${meta.entity}\u6CA1\u6709\u767B\u8BB0\u300C${action}\u300D\u8FD9\u4E2A\u52A8\u4F5C` };
  }
  if (targetIndex <= currentIndex) {
    return {
      ok: false,
      message: `\u72B6\u6001\u53EA\u80FD\u5411\u524D\u6D41\u8F6C\uFF0C\u300C${row2.status}\u300D\u4E0D\u80FD\u56DE\u5230\u300C${target}\u300D\uFF0C\u8BE5\u52A8\u4F5C\u5DF2\u9000\u56DE`
    };
  }
  if (targetIndex !== currentIndex + 1) {
    return {
      ok: false,
      message: `\u4E0D\u80FD\u4ECE\u300C${row2.status}\u300D\u76F4\u63A5\u8DF3\u5230\u300C${target}\u300D\uFF0C\u5F53\u524D\u505C\u5728\u7B2C ${currentIndex + 1} \u6B65\u300C${row2.status}\u300D\uFF0C\u8BF7\u5148\u8D70\u300C${meta.statuses[currentIndex + 1]}\u300D`
    };
  }
  return null;
}
function stampStatus(meta, row2, target) {
  row2.status = target;
  row2.pending = isPendingStatus(meta, target);
  row2.abnormal = isAbnormalStatus(meta, target);
}
function runUnitAction(row2, action, target, at) {
  const required = UNIT_ACTION_GUARD[action];
  if (row2.status !== required) {
    return { ok: false, message: blockedMessage(row2.status, required, action) };
  }
  const patch = {};
  let messageExtra = "";
  if (action === UNIT_ACTION.START) {
    row2["\u5E76\u7F51\u65F6\u523B"] = at;
    row2["\u505C\u673A\u65F6\u523B"] = "";
  } else if (action === UNIT_ACTION.STOP || action === UNIT_ACTION.FAULT) {
    row2["\u7D2F\u8BA1\u8FD0\u884C\u5C0F\u65F6"] = runningHours(row2, at);
    row2["\u505C\u673A\u65F6\u523B"] = at;
    row2["\u5E76\u7F51\u65F6\u523B"] = "";
    row2["\u632F\u52A8\u6570\u503C"] = action === UNIT_ACTION.STOP ? 0 : row2["\u632F\u52A8\u6570\u503C"];
  }
  if (action === UNIT_ACTION.FAULT) {
    const code = String(row2["\u673A\u7EC4\u7F16\u53F7"] ?? "");
    const overhaulRows = [...listRows("overhaul")];
    const ticketId = overhaulRows.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
    const ticket = {
      id: ticketId,
      status: OVERHAUL_STATUS.PENDING_APPROVAL,
      pending: true,
      abnormal: false,
      \u5DE5\u4F5C\u7968\u53F7: `WO-${formatDate(at).split("-").join("")}-${String(ticketId).padStart(3, "0")}`,
      \u5173\u8054\u673A\u7EC4: code,
      \u68C0\u4FEE\u7EA7\u522B: "\u672A\u5206\u7EA7",
      \u8BA1\u5212\u5DE5\u671F: "",
      \u5B9E\u9645\u5DE5\u671F: "",
      \u5DE5\u4F5C\u8D1F\u8D23\u4EBA: "",
      \u9A8C\u6536\u4EBA\u5458: "",
      \u68C0\u4FEE\u72B6\u6001: OVERHAUL_STATUS.PENDING_APPROVAL,
      \u53F0\u8D26: []
    };
    appendLedger(
      ticket,
      {
        from: "\u2014",
        to: OVERHAUL_STATUS.PENDING_APPROVAL,
        action: "\u767B\u8BB0\u6545\u969C\u8054\u52A8",
        source: "\u6545\u969C\u8054\u52A8",
        note: `${code} \u767B\u8BB0\u6545\u969C\u8054\u52A8\u5F00\u7968\uFF0C\u673A\u7EC4\u68C0\u4FEE\u95ED\u73AF\u524D\u4E0D\u5F97\u56DE\u505C\u673A\u5907\u7528`
      },
      at
    );
    overhaulRows.push(ticket);
    patch["overhaul"] = overhaulRows;
    const defectRows = [...listRows("defect")];
    const draft = {
      \u8BBE\u5907\u540D\u79F0: `${code} \u6C34\u8F6E\u53D1\u7535\u673A\u7EC4`,
      \u7F3A\u9677\u63CF\u8FF0: "\u673A\u7EC4\u767B\u8BB0\u6545\u969C\uFF0C\u5F85\u68C0\u67E5\u786E\u8BA4",
      \u7F3A\u9677\u7B49\u7EA7: "\u91CD\u5927",
      \u53D1\u73B0\u65E5\u671F: formatDate(at),
      \u5904\u7406\u671F\u9650: "",
      \u5904\u7406\u4EBA\u5458: "",
      \u6765\u6E90: "\u6545\u969C\u8054\u52A8"
    };
    if (!findDuplicateDefect(defectRows, draft)) {
      const defectId = defectRows.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
      const number = `DEFE-${formatDate(at).split("-").join("")}-${String(defectId).padStart(4, "0")}`;
      const defect = {
        id: defectId,
        status: DEFECT_STATUS.PENDING,
        pending: true,
        abnormal: false,
        \u7F3A\u9677\u7F16\u53F7: number,
        ...draft,
        \u53F0\u8D26: []
      };
      appendLedger(
        defect,
        { from: "\u2014", to: DEFECT_STATUS.PENDING, action: "\u767B\u8BB0\u6545\u969C\u8054\u52A8", source: "\u6545\u969C\u8054\u52A8" },
        at
      );
      defectRows.push(defect);
      patch["defect"] = defectRows;
    }
    messageExtra = `\uFF1B\u5DF2\u8054\u52A8\u5F00\u68C0\u4FEE\u7968 ${ticket.\u5DE5\u4F5C\u7968\u53F7}\uFF08\u5F85\u5BA1\u6279\uFF09\u5E76\u767B\u8BB0\u7F3A\u9677\uFF0C\u673A\u7EC4\u9700\u8D70\u5B8C\u68C0\u4FEE\u95ED\u73AF\u624D\u80FD\u56DE\u505C\u673A\u5907\u7528`;
  }
  const meta = moduleMeta("unit");
  appendLedger(row2, { from: row2.status, to: target, action, source: "\u673A\u7EC4\u64CD\u4F5C" }, at);
  stampStatus(meta, row2, target);
  patch["unit"] = updateRowIn(listRows("unit"), row2);
  saveMany(patch);
  return { ok: true, message: `${meta.entity}\u5DF2${action}\uFF0C\u5F53\u524D\u72B6\u6001\u300C${target}\u300D${messageExtra}` };
}
function runOverhaulAction(row2, action, target, at) {
  const meta = moduleMeta("overhaul");
  const blocked = guardOrderedStep(meta, row2, action, target);
  if (blocked) {
    return blocked;
  }
  const unitRows = listRows("unit");
  const unitCode = String(row2["\u5173\u8054\u673A\u7EC4"] ?? "");
  const unit = unitRows.find((item) => String(item["\u673A\u7EC4\u7F16\u53F7"] ?? "") === unitCode);
  if (action === OVERHAUL_ACTION.START) {
    if (!unitCode || !unit) {
      return { ok: false, message: `\u68C0\u4FEE\u7968 ${row2["\u5DE5\u4F5C\u7968\u53F7"]} \u6CA1\u6709\u5173\u8054\u5230\u5728\u518C\u673A\u7EC4\uFF0C\u4E0D\u5177\u5907\u5F00\u5DE5\u8D44\u683C\uFF0C\u8BF7\u5148\u8865\u5173\u8054\u673A\u7EC4` };
    }
    if (unit.status !== UNIT_STATUS.STANDBY && unit.status !== UNIT_STATUS.FAULT) {
      return {
        ok: false,
        message: `\u5173\u8054\u673A\u7EC4 ${unitCode} \u5F53\u524D\u505C\u5728\u300C${unit.status}\u300D\uFF0C\u53EA\u6709\u505C\u673A\u5907\u7528/\u6545\u969C\u505C\u673A\u7684\u673A\u7EC4\u53EF\u4EE5\u5F00\u5DE5\uFF0C${row2["\u5DE5\u4F5C\u7968\u53F7"]} \u6682\u4E0D\u80FD\u5F00\u5DE5`
      };
    }
    const busy = listRows("overhaul").some(
      (item) => Number(item.id) !== Number(row2.id) && String(item["\u5173\u8054\u673A\u7EC4"] ?? "") === unitCode && item.status === OVERHAUL_STATUS.REPAIRING
    );
    if (busy) {
      return {
        ok: false,
        message: `\u673A\u7EC4 ${unitCode} \u5DF2\u6709\u68C0\u4FEE\u4E2D\u7684\u5DE5\u4F5C\u7968\uFF0C\u5FC5\u987B\u5148\u529E\u7406\u5B8C\u5DE5\u95ED\u73AF\uFF0C${row2["\u5DE5\u4F5C\u7968\u53F7"]} \u4E0D\u80FD\u91CD\u590D\u5F00\u5DE5`
      };
    }
  }
  const patch = {};
  let closedUnit = false;
  if (action === OVERHAUL_ACTION.FINISH && unit && unit.status === UNIT_STATUS.FAULT) {
    appendLedger(
      unit,
      {
        from: UNIT_STATUS.FAULT,
        to: UNIT_STATUS.STANDBY,
        action: "\u68C0\u4FEE\u95ED\u73AF",
        source: "\u68C0\u4FEE\u95ED\u73AF",
        note: `\u68C0\u4FEE\u7968 ${row2["\u5DE5\u4F5C\u7968\u53F7"]} \u529E\u7406\u5B8C\u5DE5\uFF0C\u9A8C\u6536\u5408\u683C\u56DE\u505C\u673A\u5907\u7528`
      },
      at
    );
    stampStatus(metaOf("unit"), unit, UNIT_STATUS.STANDBY);
    unit["\u505C\u673A\u65F6\u523B"] = at;
    patch["unit"] = updateRowIn(unitRows, unit);
    closedUnit = true;
  }
  appendLedger(row2, { from: row2.status, to: target, action, source: "\u68C0\u4FEE\u64CD\u4F5C" }, at);
  stampStatus(meta, row2, target);
  patch["overhaul"] = updateRowIn(listRows("overhaul"), row2);
  saveMany(patch);
  const closed = closedUnit ? `\uFF1B\u5173\u8054\u673A\u7EC4 ${unitCode} \u5DF2\u95ED\u73AF\u56DE\u505C\u673A\u5907\u7528` : "";
  return { ok: true, message: `\u68C0\u4FEE\u5DE5\u4F5C\u7968\u5DF2${action}\uFF0C\u5F53\u524D\u72B6\u6001\u300C${target}\u300D${closed}` };
}
function createDefect(draftInput) {
  const at = nowIso();
  const draft = { ...draftInput, \u6765\u6E90: "\u4EBA\u5DE5\u767B\u8BB0" };
  const rows = [...listRows("defect")];
  const duplicate = findDuplicateDefect(rows, draft);
  if (duplicate) {
    return {
      ok: false,
      message: `\u8BE5\u7F3A\u9677\u5DF2\u767B\u8BB0\u8FC7\uFF08\u7F16\u53F7 ${duplicate["\u7F3A\u9677\u7F16\u53F7"]}\uFF0C\u5F53\u524D\u300C${duplicate.status}\u300D\uFF09\uFF0C\u91CD\u590D\u767B\u8BB0\u53EA\u8BA4\u7B2C\u4E00\u6B21\u5165\u5E93\u7684\u53D6\u503C\uFF0C\u672C\u6761\u672A\u4FDD\u5B58`
    };
  }
  const id = rows.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
  const number = draft.\u7F3A\u9677\u7F16\u53F7?.trim() || `DEFE-${draft.\u53D1\u73B0\u65E5\u671F.split("-").join("")}-${String(id).padStart(4, "0")}`;
  const row2 = {
    id,
    status: DEFECT_STATUS.PENDING,
    pending: true,
    abnormal: false,
    \u7F3A\u9677\u7F16\u53F7: number,
    \u8BBE\u5907\u540D\u79F0: draft.\u8BBE\u5907\u540D\u79F0,
    \u7F3A\u9677\u63CF\u8FF0: draft.\u7F3A\u9677\u63CF\u8FF0,
    \u7F3A\u9677\u7B49\u7EA7: draft.\u7F3A\u9677\u7B49\u7EA7,
    \u53D1\u73B0\u65E5\u671F: draft.\u53D1\u73B0\u65E5\u671F,
    \u5904\u7406\u671F\u9650: draft.\u5904\u7406\u671F\u9650,
    \u5904\u7406\u4EBA\u5458: draft.\u5904\u7406\u4EBA\u5458,
    \u6765\u6E90: "\u4EBA\u5DE5\u767B\u8BB0",
    \u53F0\u8D26: []
  };
  appendLedger(
    row2,
    {
      from: "\u2014",
      to: DEFECT_STATUS.PENDING,
      action: "\u4EBA\u5DE5\u767B\u8BB0",
      source: "\u4EBA\u5DE5\u767B\u8BB0",
      note: `\u7B49\u7EA7\u53E3\u5F84\uFF1A${DEFECT_LEVELS.includes(draft.\u7F3A\u9677\u7B49\u7EA7) ? draft.\u7F3A\u9677\u7B49\u7EA7 : `${draft.\u7F3A\u9677\u7B49\u7EA7}\uFF08\u975E\u6807\u51C6\u7B49\u7EA7\uFF0C\u6309\u539F\u503C\u4FDD\u7559\u4E0D\u6539\u5199\uFF09`}`
    },
    at
  );
  rows.push(row2);
  saveRows("defect", rows);
  return { ok: true, message: `\u8BBE\u5907\u7F3A\u9677 ${number} \u5DF2\u767B\u8BB0\uFF0C\u5F53\u524D\u72B6\u6001\u300C\u5F85\u5904\u7406\u300D` };
}
function runDefectAction(row2, action, target, at) {
  const meta = moduleMeta("defect");
  const blocked = guardOrderedStep(meta, row2, action, target);
  if (blocked) {
    return blocked;
  }
  appendLedger(row2, { from: row2.status, to: target, action, source: "\u7F3A\u9677\u5904\u7F6E" }, at);
  stampStatus(meta, row2, target);
  saveRows("defect", updateRowIn(listRows("defect"), row2));
  if (action === DEFECT_ACTION.ARCHIVE) {
    return { ok: true, message: `\u7F3A\u9677 ${row2["\u7F3A\u9677\u7F16\u53F7"]} \u5DF2\u5F52\u6863\uFF0C\u6E05\u5355\u4E2D\u4ECD\u53EF\u67E5\u5230\u8BE5\u8BB0\u5F55` };
  }
  return { ok: true, message: `\u8BBE\u5907\u7F3A\u9677\u5DF2${action}\uFF0C\u5F53\u524D\u72B6\u6001\u300C${target}\u300D` };
}
function runSpareAction(row2, action, target, at) {
  const meta = moduleMeta("spare");
  const blocked = guardOrderedStep(meta, row2, action, target);
  if (blocked) {
    return blocked;
  }
  if (action === SPARE_ACTION.ISSUE) {
    const result = issueSpare(row2);
    if (!result.ok) {
      return result;
    }
  } else if (action === SPARE_ACTION.REORDER) {
    const stock = toNumber(row2["\u73B0\u6709\u6570\u91CF"]);
    const floor = toNumber(row2["\u6700\u4F4E\u50A8\u5907\u91CF"]);
    if (floor > 0 && stock >= floor) {
      return { ok: false, message: `\u73B0\u6709\u6570\u91CF ${stock} \u4E0D\u4F4E\u4E8E\u6700\u4F4E\u50A8\u5907\u91CF ${floor}\uFF0C\u65E0\u9700\u63D0\u4EA4\u8865\u5145` };
    }
  }
  appendLedger(
    row2,
    {
      from: row2.status,
      to: target,
      action,
      source: "\u5907\u4EF6\u64CD\u4F5C",
      ...action === SPARE_ACTION.ISSUE ? { note: `\u672C\u6B21\u9886\u7528 ${ISSUE_QTY} \u4EF6` } : {}
    },
    at
  );
  stampStatus(meta, row2, target);
  saveRows("spare", updateRowIn(listRows("spare"), row2));
  const qty = action === SPARE_ACTION.ISSUE ? `\uFF0C\u672C\u6B21\u6263\u51CF ${ISSUE_QTY} \u4EF6\uFF0C\u5E93\u5B58\u5269 ${row2["\u73B0\u6709\u6570\u91CF"]} \u4EF6` : "";
  return { ok: true, message: `\u5907\u54C1\u5907\u4EF6\u5DF2${action}\uFF0C\u5F53\u524D\u72B6\u6001\u300C${target}\u300D${qty}` };
}
function updateRowIn(rows, row2) {
  const index = rows.findIndex((item) => Number(item.id) === Number(row2.id));
  if (index < 0) {
    return [...rows, row2];
  }
  const next = [...rows];
  next[index] = row2;
  return next;
}
function metaOf(key) {
  return MODULE_BY_KEY.get(key);
}
function runAction(key, id, action) {
  const meta = moduleMeta(key);
  const target = meta.actionTargets[action];
  if (!target) {
    return { ok: false, message: `${meta.entity}\u6CA1\u6709\u767B\u8BB0\u300C${action}\u300D\u8FD9\u4E2A\u52A8\u4F5C` };
  }
  const rows = listRows(key);
  const index = rows.findIndex((row3) => Number(row3.id) === id);
  if (index < 0) {
    return { ok: false, message: `\u6CA1\u6709\u627E\u5230\u7F16\u53F7\u4E3A ${id} \u7684${meta.entity}` };
  }
  const row2 = rows[index];
  if (row2.status === target) {
    return { ok: false, message: `${meta.entity}\u5DF2\u7ECF\u662F\u300C${target}\u300D\uFF0C\u4E0D\u7528\u91CD\u590D\u64CD\u4F5C` };
  }
  const at = nowIso();
  if (key === "unit") {
    return runUnitAction(row2, action, target, at);
  }
  if (key === "overhaul") {
    return runOverhaulAction(row2, action, target, at);
  }
  if (key === "defect") {
    return runDefectAction(row2, action, target, at);
  }
  if (key === "spare") {
    return runSpareAction(row2, action, target, at);
  }
  const blocked = guardOrderedStep(meta, row2, action, target);
  if (blocked) {
    return blocked;
  }
  appendLedger(row2, { from: row2.status, to: target, action, source: "\u4E1A\u52A1\u64CD\u4F5C" }, at);
  stampStatus(meta, row2, target);
  saveRows(key, updateRowIn(rows, row2));
  return { ok: true, message: `${meta.entity}\u5DF2${action}\uFF0C\u5F53\u524D\u72B6\u6001\u300C${target}\u300D` };
}
function loadAdjustableCapacity(at = nowIso()) {
  const rows = listRows("unit");
  const metrics = unitMetrics(rows, at);
  return {
    totalMw: metrics.adjustableMw,
    runningCount: metrics.runningCount,
    standbyCount: rows.filter((row2) => row2.status === UNIT_STATUS.STANDBY).length,
    faultCount: metrics.faultCount,
    readyCount: rows.filter((row2) => row2.status === UNIT_STATUS.READY).length,
    excluded: rows.filter(isFaultRow).map((row2) => ({
      code: String(row2["\u673A\u7EC4\u7F16\u53F7"] ?? ""),
      reason: "\u6545\u969C\u505C\u673A\uFF1A\u672A\u8D70\u5B8C\u68C0\u4FEE\u95ED\u73AF\uFF0C\u4E0D\u8BA1\u5165\u53EF\u8C03\u51FA\u529B"
    }))
  };
}
function isFaultRow(row2) {
  return row2.status === UNIT_STATUS.FAULT;
}
function resetModule(key) {
  resetRows(key);
  return listEntries(key);
}
function loadOverview() {
  const rows = allRows();
  const modules = [...MODULE_BY_KEY.values()].map((meta) => {
    const entries = rows[meta.key] ?? [];
    return {
      name: meta.name,
      created: entries.length,
      pending: entries.filter((row2) => isPendingStatus(meta, row2.status)).length,
      abnormal: entries.filter((row2) => isAbnormalStatus(meta, row2.status)).length
    };
  });
  const cards = [
    { label: "\u4E1A\u52A1\u6A21\u5757", value: modules.length },
    { label: "\u767B\u8BB0\u603B\u91CF", value: modules.reduce((sum, item) => sum + item.created, 0) },
    { label: "\u5F85\u5904\u7406", value: modules.reduce((sum, item) => sum + item.pending, 0) },
    { label: "\u5F02\u5E38\u91CF", value: modules.reduce((sum, item) => sum + item.abnormal, 0) }
  ];
  return { cards, modules };
}

// scripts/flow-check.ts
var mem = /* @__PURE__ */ new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => mem.has(k) ? mem.get(k) : null,
    setItem: (k, v) => void mem.set(k, v),
    removeItem: (k) => void mem.delete(k)
  }
};
var failures = 0;
function check(name, cond, extra = "") {
  if (cond) {
    console.log(`PASS ${name}`);
  } else {
    failures += 1;
    console.error(`FAIL ${name} ${extra}`);
  }
}
function row(key, id) {
  return allRows()[key].find((r) => Number(r.id) === id);
}
var cap0 = loadAdjustableCapacity();
check("\u53EF\u8C03\u51FA\u529B\u5254\u9664\u6545\u969C\u673A\u7EC4", cap0.totalMw === 165, `got ${cap0.totalMw}`);
check("\u6545\u969C\u53F0\u6570=1", cap0.faultCount === 1);
check("\u8FD0\u884C\u53F0\u6570=1", cap0.runningCount === 1);
var jump = runAction("unit", 3, "\u505C\u673A\u8F6C\u5907");
check("\u8DF3\u6B65\u9000\u56DE", !jump.ok && jump.message.includes("\u53EA\u80FD\u4ECE") && jump.message.includes("\u505C\u673A\u8F6C\u5907"), jump.message);
check("\u8DF3\u6B65\u4E0D\u6539\u72B6\u6001", row("unit", 3).status === "\u5F85\u542F\u52A8");
var start1 = runAction("unit", 3, "\u5F00\u673A\u5E76\u7F51");
var start2 = runAction("unit", 3, "\u5F00\u673A\u5E76\u7F51");
check("\u9996\u6B21\u5F00\u673A\u6210\u529F", start1.ok, start1.message);
check("\u91CD\u590D\u5F00\u673A\u9000\u56DE\u4E0D\u591A\u53F0\u6570", !start2.ok && row("unit", 3).status === "\u8FD0\u884C\u4E2D", start2.message);
check("\u5F00\u673A\u540E\u8FD0\u884C\u53F0\u6570=2", loadAdjustableCapacity().runningCount === 2);
var hoursRunning = Number(row("unit", 3)["\u7D2F\u8BA1\u8FD0\u884C\u5C0F\u65F6"]);
var ledger = row("unit", 3)["\u53F0\u8D26"];
check("\u5E76\u7F51\u5199\u53F0\u8D26", Array.isArray(ledger) && ledger.some((e) => e.action === "\u5F00\u673A\u5E76\u7F51"));
var fault = runAction("unit", 3, "\u767B\u8BB0\u6545\u969C");
check("\u767B\u8BB0\u6545\u969C\u6210\u529F\u5E76\u8054\u52A8", fault.ok && fault.message.includes("\u8054\u52A8\u5F00\u68C0\u4FEE\u7968"), fault.message);
check("\u6545\u969C\u540E\u5254\u9664\u53EF\u8C03", loadAdjustableCapacity().totalMw === 90, `got ${loadAdjustableCapacity().totalMw}`);
check("\u6545\u969C\u540E\u4E0D\u8BA1\u8FD0\u884C\u53F0\u6570", loadAdjustableCapacity().runningCount === 1);
var newTicket = allRows()["overhaul"].find((t) => String(t["\u5173\u8054\u673A\u7EC4"]) === "UNIT-0003" && t.status === "\u5F85\u5BA1\u6279");
check("\u8054\u52A8\u68C0\u4FEE\u7968\u5F85\u5BA1\u6279", !!newTicket);
var newDefect = allRows()["defect"].find((d) => String(d["\u8BBE\u5907\u540D\u79F0"] ?? "").includes("UNIT-0003"));
check("\u8054\u52A8\u7F3A\u9677\u767B\u8BB0", !!newDefect && newDefect.status === "\u5F85\u5904\u7406");
var resumeFault = runAction("unit", 3, "\u6062\u590D\u5F85\u542F\u52A8");
check("\u6545\u969C\u673A\u4E0D\u80FD\u76F4\u63A5\u6062\u590D\u5F85\u542F\u52A8", !resumeFault.ok, resumeFault.message);
var stopFault = runAction("unit", 3, "\u505C\u673A\u8F6C\u5907");
check("\u6545\u969C\u673A\u4E0D\u80FD\u76F4\u63A5\u505C\u673A\u8F6C\u5907", !stopFault.ok, stopFault.message);
var submit = runAction("overhaul", Number(newTicket.id), "\u63D0\u4EA4\u5BA1\u6279");
check("\u68C0\u4FEE\u7968\u63D0\u4EA4\u5BA1\u6279", submit.ok, submit.message);
var startRepair = runAction("overhaul", Number(newTicket.id), "\u5F00\u5DE5\u68C0\u4FEE");
check("\u6545\u969C\u673A\u7EC4\u68C0\u4FEE\u7968\u53EF\u5F00\u5DE5", startRepair.ok, startRepair.message);
var blockedStart = runAction("overhaul", 2, "\u5F00\u5DE5\u68C0\u4FEE");
check("\u540C\u673A\u7EC4\u5DF2\u6709\u68C0\u4FEE\u4E2D\u7968\u4E0D\u80FD\u91CD\u590D\u5F00\u5DE5", !blockedStart.ok && blockedStart.message.includes("\u5DF2\u6709\u68C0\u4FEE\u4E2D\u7684\u5DE5\u4F5C\u7968"), blockedStart.message);
var finish = runAction("overhaul", Number(newTicket.id), "\u529E\u7406\u5B8C\u5DE5");
check("\u68C0\u4FEE\u5B8C\u5DE5\u95ED\u73AF", finish.ok && finish.message.includes("\u95ED\u73AF\u56DE\u505C\u673A\u5907\u7528"), finish.message);
check("\u673A\u7EC4\u95ED\u73AF\u56DE\u505C\u673A\u5907\u7528", row("unit", 3).status === "\u505C\u673A\u5907\u7528", row("unit", 3).status);
check("\u95ED\u73AF\u540E\u6062\u590D\u53EF\u8C03", loadAdjustableCapacity().totalMw === 165, `got ${loadAdjustableCapacity().totalMw}`);
check("\u505C\u673A\u5907\u7528\u53EF\u6062\u590D\u5F85\u542F\u52A8", runAction("unit", 3, "\u6062\u590D\u5F85\u542F\u52A8").ok);
check("\u518D\u5F00\u673A\u6210\u529F", runAction("unit", 3, "\u5F00\u673A\u5E76\u7F51").ok);
var dup = createDefect({
  \u7F3A\u9677\u7F16\u53F7: "DUP-1",
  \u8BBE\u5907\u540D\u79F0: "TEST-DEV",
  \u7F3A\u9677\u63CF\u8FF0: "\u540C\u4E00\u6BDB\u75C5",
  \u7F3A\u9677\u7B49\u7EA7: "\u7D27\u6025",
  \u53D1\u73B0\u65E5\u671F: "2026-10-05",
  \u5904\u7406\u671F\u9650: "",
  \u5904\u7406\u4EBA\u5458: ""
});
var dup2 = createDefect({
  \u7F3A\u9677\u7F16\u53F7: "DUP-2",
  \u8BBE\u5907\u540D\u79F0: "TEST-DEV",
  \u7F3A\u9677\u63CF\u8FF0: "\u540C\u4E00\u6BDB\u75C5",
  \u7F3A\u9677\u7B49\u7EA7: "\u4E00\u822C",
  \u53D1\u73B0\u65E5\u671F: "2026-10-05",
  \u5904\u7406\u671F\u9650: "",
  \u5904\u7406\u4EBA\u5458: ""
});
check("\u9996\u6B21\u7F3A\u9677\u767B\u8BB0\u6210\u529F", dup.ok, dup.message);
check("\u91CD\u590D\u7F3A\u9677\u9000\u56DE\u4E14\u4FDD\u7559\u9996\u4EFD\u7B49\u7EA7", !dup2.ok && dup2.message.includes("\u53EA\u8BA4\u7B2C\u4E00\u6B21"), dup2.message);
var firstDef = allRows()["defect"].find((d) => d["\u7F3A\u9677\u7F16\u53F7"] === "DUP-1");
check("\u9996\u4EFD\u7F3A\u9677\u7B49\u7EA7\u672A\u88AB\u8986\u76D6", firstDef["\u7F3A\u9677\u7B49\u7EA7"] === "\u7D27\u6025");
var beforeCount = listEntries("defect").total;
check("\u5F85\u5904\u7406\u4E0D\u80FD\u76F4\u63A5\u786E\u8BA4\u6D88\u9664\uFF08\u8DF3\u6B65\uFF09", !runAction("defect", Number(firstDef.id), "\u786E\u8BA4\u6D88\u9664").ok);
check("\u6D3E\u53D1\u5904\u7406", runAction("defect", Number(firstDef.id), "\u6D3E\u53D1\u5904\u7406").ok);
check("\u786E\u8BA4\u6D88\u9664\u2192\u5DF2\u5B8C\u6210", runAction("defect", Number(firstDef.id), "\u786E\u8BA4\u6D88\u9664").ok);
check("\u5B8C\u6210\u4E0D\u80FD\u56DE\u5934\u6D3E\u53D1", !runAction("defect", Number(firstDef.id), "\u6D3E\u53D1\u5904\u7406").ok);
check("\u5F52\u6863", runAction("defect", Number(firstDef.id), "\u5F52\u6863").ok);
check("\u5F52\u6863\u540E\u4ECD\u5728\u6E05\u5355", listEntries("defect").total === beforeCount);
check("\u5F52\u6863\u4E3A\u7EC8\u6001\u65E0\u5F85\u5904\u7406", firstDef.pending === false);
resetModule("spare");
var beforeStock = Number(row("spare", 1)["\u73B0\u6709\u6570\u91CF"]);
check("\u5F85\u9A8C\u6536\u4E0D\u80FD\u76F4\u63A5\u9886\u7528\uFF08\u8DF3\u6B65\uFF09", !runAction("spare", 1, "\u9886\u7528\u5907\u4EF6").ok);
check("\u529E\u7406\u9A8C\u6536", runAction("spare", 1, "\u529E\u7406\u9A8C\u6536").ok);
var issue1 = runAction("spare", 1, "\u9886\u7528\u5907\u4EF6");
var issue2 = runAction("spare", 1, "\u9886\u7528\u5907\u4EF6");
check("\u9886\u7528\u6210\u529F\u6263\u4E00\u4EF6", issue1.ok && Number(row("spare", 1)["\u73B0\u6709\u6570\u91CF"]) === beforeStock - 1, issue1.message);
check("\u91CD\u590D\u9886\u7528\u9000\u56DE\u4E0D\u591A\u6263", !issue2.ok && Number(row("spare", 1)["\u73B0\u6709\u6570\u91CF"]) === beforeStock - 1, issue2.message);
check("\u7D2F\u8BA1\u9886\u7528=1", Number(row("spare", 1)["\u7D2F\u8BA1\u9886\u7528"]) === 1);
var overview = loadOverview();
var stationOverview = overview.modules.find((m) => m.name === "\u7535\u7AD9\u53F0\u8D26");
check("\u6982\u89C8\u6761\u6570\u4E0E\u5217\u8868\u4E00\u81F4", stationOverview.created === listEntries("station").total);
var defectOverview = overview.modules.find((m) => m.name === "\u7F3A\u9677\u5904\u7F6E");
check("\u6982\u89C8\u7F3A\u9677\u6761\u6570\u542B\u5F52\u6863", defectOverview.created === listEntries("defect").total);
check(
  "\u6982\u89C8\u603B\u91CF=\u5404\u5217\u8868\u4E4B\u548C",
  overview.cards[1].value === overview.modules.reduce((s, m) => s + m.created, 0)
);
console.log(failures === 0 ? "\n\u5168\u90E8\u901A\u8FC7" : `
${failures} \u9879\u5931\u8D25`);
process.exit(failures === 0 ? 0 : 1);
