(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  jQuery(function($) {
    return $.fn.tabbers = function(opt) {
      var cls, find, find_cont_by_id, find_head_by_id, jo, key, lang, map, ref, sel, sf, value;
      this.initalize = function() {
        sf.enumerate_list(map.list.head);
        sf.enumerate_list(map.list.cont);
        return map.tabits = {
          head: map.list.head.children(sel.tabit),
          cont: map.list.cont.children(sel.tabit)
        };
      };
      this.observers = function() {
        return sf.observe_hover();
      };
      this.triggers = function() {
        if (!opt.allow_many_open_tabs) {
          jo.bind("expand." + opt.namespace, function(e, el) {
            return el.each(function() {
              return sf.collapse_tabits();
            });
          });
        }
        jo.bind("expand." + opt.namespace, function(e, el) {
          return el.each(function() {
            return sf.switch_tabit_class($(this), cls.expanded, cls.collapsed);
          });
        });
        jo.bind("collapse." + opt.namespace, function(e, el) {
          return el.each(function() {
            return sf.switch_tabit_class($(this), cls.collapsed, cls.expanded);
          });
        });
        jo.bind("hover_in." + opt.namespace, function(e, el) {
          return el.each(function() {
            return sf.add_class_to_tabit($(this), cls.hovering);
          });
        });
        jo.bind("hover_out." + opt.namespace, function(e, el) {
          return el.each(function() {
            return sf.remove_class_from_tabit($(this), cls.hovering);
          });
        });
        if (opt.collapse_timer) {
          jo.bind("expand." + opt.namespace, function(e, el) {
            return el.each(function() {
              return sf.collapse_timeout($(this));
            });
          });
          return jo.bind("hover_out." + opt.namespace, function(e, el) {
            return el.each(function() {
              return sf.collapse_timeout($(this));
            });
          });
        }
      };
      this.interactions = function() {
        map.tabits.head.click(function(e) {
          sf.toggle_tabit($(this));
          return e.preventDefault();
        });
        return find(sel.collapse).click(function(e) {
          if (opt.collapsible) {
            sf.collapse($(this).closest(sel.tabit));
          }
          return e.preventDefault();
        });
      };
      this.defaults = function() {
        if ((opt.active_tab != null) && !opt.collapsed) {
          sf.expand_by_id(opt.active_tab);
        }
        if (opt.collapsed) {
          return sf.collapse_tabits();
        }
      };
      this.enumerate_list = function(ul) {
        var t;
        t = 0;
        return ul.children('li').each(function() {
          $(this).addClass("" + cls.tabit + " " + cls.tabit + "-" + t).data('tabit_id', t);
          return t++;
        });
      };
      this.observe_hover = function() {
        return $([map.tabits.head, map.tabits.cont]).each(function() {
          return $(this).hover(function() {
            return sf.trigger("hover_in." + opt.namespace, [$(this)]);
          }, function() {
            return sf.trigger("hover_out." + opt.namespace, [$(this)]);
          });
        });
      };
      this.toggle_tabit = function(el) {
        return el.each(function() {
          if ($(this).hasClass(cls.expanded) && opt.collapsible) {
            return sf.collapse($(this));
          } else {
            return sf.expand($(this));
          }
        });
      };
      this.switch_tabit_class = function(el, add, remove) {
        sf.add_class_to_tabit(el, add);
        return sf.remove_class_from_tabit(el, remove);
      };
      this.add_class_to_tabit = function(el, name) {
        var id;
        id = el.data('tabit_id');
        find_cont_by_id(id).addClass(name);
        return find_head_by_id(id).addClass(name);
      };
      this.remove_class_from_tabit = function(el, name) {
        var id;
        id = el.data('tabit_id');
        find_cont_by_id(id).removeClass(name);
        return find_head_by_id(id).removeClass(name);
      };
      this.collapse_timeout = function(el) {
        if (map.timeout != null) {
          clearTimeout(map.timeout);
        }
        return map.timeout = setTimeout((__bind(function() {
          if (!el.hasClass(cls.hovering)) {
            return sf.collapse(el);
          }
        }, this)), opt.collapse_timer);
      };
      this.collapse_tabits = function() {
        return sf.collapse(map.tabits.cont);
      };
      this.collapse_by_id = function(id) {
        return sf.collapse(find_cont_by_id(id));
      };
      this.expand_by_id = function(id) {
        return sf.expand(find_cont_by_id(id));
      };
      this.collapse = function(el) {
        return el.each(function() {
          return sf.trigger("collapse." + opt.namespace, [$(this)]);
        });
      };
      this.expand = function(el) {
        return el.each(function() {
          return sf.trigger("expand." + opt.namespace, [$(this)]);
        });
      };
      sf = this;
      jo = $(this);
      opt = $.extend({
        log: false,
        active_tab: 0,
        collapsible: true,
        collapsed: true,
        collapse_timer: false,
        allow_many_open_tabs: false,
        namespace: 'tabbers',
        lang: {},
        classes: {
          head: 'tabbers-header',
          cont: 'tabbers-content',
          tabit_head: 'tabit-head',
          tabit: 'tabit',
          collapsed: 'tabit-collapsed',
          collapse: 'tabbers-collapse',
          expanded: 'tabit-expanded',
          animating: 'tabit-animating',
          hovering: 'tabit-hovering'
        }
      }, opt, jo.data());
      lang = opt.lang;
      cls = opt.classes;
      sel = {};
      for (key in cls) {
        value = cls[key];
        sel[key] = "." + value;
      }
      map = {};
      ref = function() {
        return {
          map: map,
          opt: opt,
          sel: sel,
          cls: cls,
          lang: lang
        };
      };
      find = function(k) {
        return jo.find(k);
      };
      find_head_by_id = function(id, key) {
        return map.list.head.children("" + sel.tabit + "-" + id);
      };
      find_cont_by_id = function(id, key) {
        return map.list.cont.children("" + sel.tabit + "-" + id);
      };
      map = {
        head: find(sel.head),
        cont: find(sel.cont),
        list: {
          head: find(sel.head).children('ul'),
          cont: find(sel.cont).children('ul')
        }
      };
      this.construct = function() {
        if (sf.initalize) {
          sf.initalize();
        }
        if (opt.after_initalize) {
          opt.after_initalize(ref());
        }
        if (sf.observers) {
          sf.observers();
        }
        if (sf.triggers) {
          sf.triggers();
        }
        if (sf.interactions) {
          sf.interactions();
        }
        if (sf.defaults) {
          return sf.defaults();
        }
      };
      this.construct();
      return sf;
    };
  });
}).call(this);
