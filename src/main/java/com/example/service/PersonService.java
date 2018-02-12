package com.example.service;

import com.example.model.bo.QueryPersonBo;
import com.example.model.vo.PageObject;
import com.example.model.vo.PersonVo;

import java.util.List;

/**
 * Created by DS on 2017/6/14.
 */
public interface PersonService {
    public PageObject queryPersonByCondition(QueryPersonBo queryPersonBo) throws Exception;

    public void saveOrUpdatePerson(PersonVo personVo);
}
