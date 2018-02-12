package com.example.service.impl;

import com.example.dao.PersonDao;
import com.example.model.bo.QueryPersonBo;
import com.example.model.vo.PageObject;
import com.example.model.vo.PersonVo;
import com.example.service.PersonService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by DS on 2017/6/14.
 */
@Service
public class PersonServiceImpl implements PersonService{

    @Autowired
    private PersonDao personDao;

    @Override
    public PageObject queryPersonByCondition(QueryPersonBo queryPersonBo) throws Exception {
        PageObject pageVO=new PageObject();
        List<PersonVo> personList =personDao.queryPersonByCondition(queryPersonBo);
        int totalNumber=personDao.queryPersonCountByCondition(queryPersonBo);
        pageVO.setCurrentPage(queryPersonBo.getPage());
        pageVO.setPageSize(queryPersonBo.getPageSize());
        pageVO.setDataList(personList);
        pageVO.setTotalCount(totalNumber);

        return  pageVO;
    }

    @Override
    public void saveOrUpdatePerson(PersonVo personVo) {
        if(StringUtils.isEmpty(personVo.getId())) {
            personDao.insertPerson(personVo);
        }else {
            personDao.update(personVo);
        }
    }
}
