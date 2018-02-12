package com.example.controller;

import com.alibaba.fastjson.JSON;
import com.example.model.dto.Response;
import com.example.model.bo.QueryPersonBo;
import com.example.model.vo.PageObject;
import com.example.model.vo.PersonVo;
import com.example.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

/**
 * Created by DS on 2017/6/14.
 */
@Controller
@RequestMapping("/person")
public class PersonController {

    @Autowired
    private PersonService personService;

    @RequestMapping("/personIndex")
    public ModelAndView index(){
        ModelAndView mv = new ModelAndView();
        mv.setViewName("person/personIndex");
        return mv;
    }

    @RequestMapping("/editPerson")
    public ModelAndView editPerson(){
        ModelAndView mv = new ModelAndView();
        mv.setViewName("person/editPerson");
        return mv;
    }

    @ResponseBody
    @RequestMapping(value = "/queryPerson", method = RequestMethod.POST)
    public Response queryPerson(@RequestBody String params) {
        Response result = new Response();
        try {
            QueryPersonBo queryPersonBo= JSON.parseObject(params,QueryPersonBo.class);
            PageObject pageObject= personService.queryPersonByCondition(queryPersonBo);
            result.data=pageObject;
            result.status = "ok";
        } catch (Exception e) {
            result.status = "error";
            result.message = e.getMessage();
            result.callStack=org.apache.commons.lang.exception.ExceptionUtils.getFullStackTrace(e);
        }

        return result;
    }


    @ResponseBody
    @RequestMapping(value = "/saveOrUpdatePerson", method = RequestMethod.POST)
    public Response saveOrUpdatePerson(@RequestBody String params) {
        Response result = new Response();
        try {
            PersonVo personVo= JSON.parseObject(params,PersonVo.class);
            personService.saveOrUpdatePerson(personVo);
            result.status = "ok";
        } catch (Exception e) {
            result.status = "error";
            result.message = e.getMessage();
            result.callStack=org.apache.commons.lang.exception.ExceptionUtils.getFullStackTrace(e);
        }

        return result;
    }
}
