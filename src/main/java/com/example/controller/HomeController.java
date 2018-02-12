package com.example.controller;

import com.example.model.dto.Response;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by DS on 2017/6/14.
 */
@Controller
@RequestMapping("/home")
public class HomeController {

    @RequestMapping("/index")
    public ModelAndView index(){
        ModelAndView mv = new ModelAndView();
        mv.addObject("info", "My First Spring Mvc and Freemarker !");
        mv.setViewName("home/index");
        return mv;
    }



}
