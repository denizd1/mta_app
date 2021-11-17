(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c6a8cfa0"],{"0496":function(t,i,e){"use strict";e.r(i);var a=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"submit-form mt-3 mx-auto"},[e("p",{staticClass:"headline"},[t._v("Add Tutorial")]),t.submitted?e("div",[e("v-card",{staticClass:"mx-auto"},[e("v-card-title",[t._v(" Submitted successfully! ")]),e("v-card-subtitle",[t._v(" Click the button to add new Tutorial. ")]),e("v-card-actions",[e("v-btn",{attrs:{color:"success"},on:{click:t.newTutorial}},[t._v("Add")])],1)],1)],1):e("div",[e("v-form",{ref:"form",attrs:{"lazy-validation":""}},[e("v-text-field",{attrs:{rules:[function(t){return!!t||"Title is required"}],label:"Title",required:""},model:{value:t.tutorial.title,callback:function(i){t.$set(t.tutorial,"title",i)},expression:"tutorial.title"}}),e("v-text-field",{attrs:{rules:[function(t){return!!t||"Description is required"}],label:"Description",required:""},model:{value:t.tutorial.description,callback:function(i){t.$set(t.tutorial,"description",i)},expression:"tutorial.description"}})],1),e("v-btn",{staticClass:"mt-3",attrs:{color:"primary"},on:{click:t.saveTutorial}},[t._v("Submit")])],1)])},r=[],n=(e("a4d3"),e("e01a"),e("f652")),s={name:"add-tutorial",data:function(){return{tutorial:{id:null,title:"",description:"",published:!1},submitted:!1}},methods:{saveTutorial:function(){var t=this,i={title:this.tutorial.title,description:this.tutorial.description};n["a"].create(i).then((function(i){t.tutorial.id=i.data.id,console.log(i.data),t.submitted=!0})).catch((function(t){console.log(t)}))},newTutorial:function(){this.submitted=!1,this.tutorial={}}}},o=s,u=(e("6c7f"),e("2877")),c=e("6544"),l=e.n(c),d=e("8336"),f=e("b0af"),h=e("99d9"),v=e("4bd4"),b=e("8654"),p=Object(u["a"])(o,a,r,!1,null,null,null);i["default"]=p.exports;l()(p,{VBtn:d["a"],VCard:f["a"],VCardActions:h["a"],VCardSubtitle:h["b"],VCardTitle:h["c"],VForm:v["a"],VTextField:b["a"]})},"4bd4":function(t,i,e){"use strict";var a=e("5530"),r=(e("caad"),e("2532"),e("07ac"),e("4de4"),e("d3b7"),e("159b"),e("7db0"),e("58df")),n=e("7e2b"),s=e("3206");i["a"]=Object(r["a"])(n["a"],Object(s["b"])("form")).extend({name:"v-form",provide:function(){return{form:this}},inheritAttrs:!1,props:{disabled:Boolean,lazyValidation:Boolean,readonly:Boolean,value:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(t){var i=Object.values(t).includes(!0);this.$emit("input",!i)},deep:!0,immediate:!0}},methods:{watchInput:function(t){var i=this,e=function(t){return t.$watch("hasError",(function(e){i.$set(i.errorBag,t._uid,e)}),{immediate:!0})},a={_uid:t._uid,valid:function(){},shouldValidate:function(){}};return this.lazyValidation?a.shouldValidate=t.$watch("shouldValidate",(function(r){r&&(i.errorBag.hasOwnProperty(t._uid)||(a.valid=e(t)))})):a.valid=e(t),a},validate:function(){return 0===this.inputs.filter((function(t){return!t.validate(!0)})).length},reset:function(){this.inputs.forEach((function(t){return t.reset()})),this.resetErrorBag()},resetErrorBag:function(){var t=this;this.lazyValidation&&setTimeout((function(){t.errorBag={}}),0)},resetValidation:function(){this.inputs.forEach((function(t){return t.resetValidation()})),this.resetErrorBag()},register:function(t){this.inputs.push(t),this.watchers.push(this.watchInput(t))},unregister:function(t){var i=this.inputs.find((function(i){return i._uid===t._uid}));if(i){var e=this.watchers.find((function(t){return t._uid===i._uid}));e&&(e.valid(),e.shouldValidate()),this.watchers=this.watchers.filter((function(t){return t._uid!==i._uid})),this.inputs=this.inputs.filter((function(t){return t._uid!==i._uid})),this.$delete(this.errorBag,i._uid)}}},render:function(t){var i=this;return t("form",{staticClass:"v-form",attrs:Object(a["a"])({novalidate:!0},this.attrs$),on:{submit:function(t){return i.$emit("submit",t)}}},this.$slots.default)}})},"615b":function(t,i,e){},"6a66":function(t,i,e){},"6c7f":function(t,i,e){"use strict";e("6a66")},"99d9":function(t,i,e){"use strict";e.d(i,"a",(function(){return n})),e.d(i,"b",(function(){return s})),e.d(i,"c",(function(){return u}));var a=e("b0af"),r=e("80d2"),n=Object(r["f"])("v-card__actions"),s=Object(r["f"])("v-card__subtitle"),o=Object(r["f"])("v-card__text"),u=Object(r["f"])("v-card__title");a["a"]},b0af:function(t,i,e){"use strict";var a=e("5530"),r=(e("a9e3"),e("0481"),e("4069"),e("615b"),e("10d2")),n=e("297c"),s=e("1c87"),o=e("58df");i["a"]=Object(o["a"])(n["a"],s["a"],r["a"]).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes:function(){return Object(a["a"])(Object(a["a"])({"v-card":!0},s["a"].options.computed.classes.call(this)),{},{"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised},r["a"].options.computed.classes.call(this))},styles:function(){var t=Object(a["a"])({},r["a"].options.computed.styles.call(this));return this.img&&(t.background='url("'.concat(this.img,'") center center / cover no-repeat')),t}},methods:{genProgress:function(){var t=n["a"].options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render:function(t){var i=this.generateRouteLink(),e=i.tag,a=i.data;return a.style=this.styles,this.isClickable&&(a.attrs=a.attrs||{},a.attrs.tabindex=0),t(e,this.setBackgroundColor(this.color,a),[this.genProgress(),this.$slots.default])}})}}]);
//# sourceMappingURL=chunk-c6a8cfa0.f0c52ff6.js.map