jQuery ($) ->
  $.fn.tabbers = (opt) ->
    
    # Prepare the DOM
    @initalize = ->
      # enumerate tabbers
      sf.enumerate_list map.list.head
      sf.enumerate_list map.list.cont
      # store tabits in map for later use
      map.tabits =
        head: map.list.head.children(sel.tabit)
        cont: map.list.cont.children(sel.tabit)
    
    # Observe changes and trigger events
    @observers = ->
      # observe mouse hovering
      sf.observe_hover()
    
    # Respond to triggered observers
    @triggers = ->
      #expand & collapse
      unless opt.allow_many_open_tabs
        jo.bind "expand.#{opt.namespace}", (e,el) -> el.each -> sf.collapse_tabits()
      jo.bind "expand.#{opt.namespace}", (e,el) -> el.each -> sf.switch_tabit_class( $(@), cls.expanded, cls.collapsed )
      jo.bind "collapse.#{opt.namespace}", (e,el) -> el.each -> sf.switch_tabit_class( $(@), cls.collapsed, cls.expanded )
      
      # hovering
      jo.bind "hover_in.#{opt.namespace}", (e,el) -> el.each -> sf.add_class_to_tabit( $(@), cls.hovering )
      jo.bind "hover_out.#{opt.namespace}", (e,el) -> el.each -> sf.remove_class_from_tabit( $(@), cls.hovering )
      # auto close if enabled
      if opt.collapse_timer
        jo.bind "expand.#{opt.namespace}", (e,el) -> el.each -> sf.collapse_timeout $(@)
        jo.bind "hover_out.#{opt.namespace}", (e,el) -> el.each -> sf.collapse_timeout $(@)

    # Respond to user interaction
    @interactions = ->
      # clicking header toggles content
      map.tabits.head.click (e) -> sf.toggle_tabit $(@); e.preventDefault()
      # collapse button collapses
      find(sel.collapse).click (e) -> sf.collapse( $(@).closest(sel.tabit) ) if opt.collapsible; e.preventDefault()

    # Load defaults defined in options
    @defaults = ->
      sf.expand_by_id(opt.active_tab) if opt.active_tab? and !opt.collapsed
      sf.collapse_tabits() if opt.collapsed
    
    
    #### ### ### ##
    #  functions  #
    #### ### ### ##
    
    @enumerate_list = (ul) -> t = 0; ul.children('li').each -> $(@).addClass("#{cls.tabit} #{cls.tabit}-#{t}").data('tabit_id', t); t++
    
    @observe_hover = ->
      $([map.tabits.head, map.tabits.cont]).each -> $(@).hover(
        -> sf.trigger("hover_in.#{opt.namespace}", [$(@)] )
        -> sf.trigger("hover_out.#{opt.namespace}", [$(@)] ))
        
    
    @toggle_tabit = (el) -> el.each -> if $(@).hasClass(cls.expanded) && opt.collapsible then sf.collapse $(@) else sf.expand $(@)
    
    @switch_tabit_class = (el, add, remove) -> sf.add_class_to_tabit(el, add); sf.remove_class_from_tabit(el, remove)
    @add_class_to_tabit = (el, name) -> 
      id = el.data('tabit_id')
      find_cont_by_id(id).addClass(name)
      find_head_by_id(id).addClass(name)
      
    @remove_class_from_tabit = (el, name) -> 
      id = el.data('tabit_id')
      find_cont_by_id(id).removeClass(name)
      find_head_by_id(id).removeClass(name)
        
    @collapse_timeout = (el) -> clearTimeout(map.timeout) if map.timeout?; map.timeout = setTimeout (=> sf.collapse(el) unless el.hasClass(cls.hovering) ), opt.collapse_timer
    @collapse_tabits = -> sf.collapse(map.tabits.cont)
    # by id
    @collapse_by_id = (id) -> sf.collapse( find_cont_by_id(id) )    
    @expand_by_id = (id) -> sf.expand( find_cont_by_id(id) )
    # base actions
    @collapse = (el) -> el.each -> sf.trigger("collapse.#{opt.namespace}", [$(@)] )
    @expand = (el) -> el.each -> sf.trigger("expand.#{opt.namespace}", [$(@)])
    
    
    #### ### ### ### ###
    #  initialization  #
    #### ### ### ### ###
    
    sf = @
    jo = $(@)
    
    opt = $.extend {
      active_tab: 0
      collapsible: true
      collapsed: true
      collapse_timer: false
      allow_many_open_tabs: false
      
      namespace:    'tabbers'
      lang: {}
      classes: {
        head:       'tabbers-header'
        cont:       'tabbers-content'
        tabit_head: 'tabit-head'
        tabit:      'tabit'
        collapsed:  'tabit-collapsed'
        collapse:   'tabbers-collapse'
        expanded:   'tabit-expanded'
        animating:  'tabit-animating'
        hovering:   'tabit-hovering'
      }
    }, opt, jo.data()
    
    lang = opt.lang
    cls = opt.classes
    sel = {}; sel[key] = ".#{value}" for key, value of cls
    map = {}
    ref = -> {map: map, opt: opt, sel: sel, cls: cls, lang: lang}
    
    find = (k) -> jo.find k
    find_head_by_id = (id, key) -> map.list.head.children("#{sel.tabit}-#{id}")
    find_cont_by_id = (id, key) -> map.list.cont.children("#{sel.tabit}-#{id}")
    
    # define a map of objects that we'll be referencing often throughout the plugin
    map =
      head: find(sel.head)
      cont: find(sel.cont)
      list:
        head: find(sel.head).children('ul')
        cont: find(sel.cont).children('ul')

    @construct = ->
      sf.initalize() if sf.initalize
      opt.after_initalize ref() if opt.after_initalize
      sf.observers() if sf.observers
      sf.triggers() if sf.triggers
      sf.interactions() if sf.interactions
      sf.defaults() if sf.defaults

    # start it up
    @construct()
        
    # return a reference to self for chaining
    return sf