package com.example.dao;

import com.example.model.bo.QueryPersonBo;
import com.example.model.vo.PersonVo;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by DS on 2017/6/14.
 */
@Repository
public interface  PersonDao {

    public List<PersonVo> queryPersonByCondition(QueryPersonBo queryPersonBo);

    public int queryPersonCountByCondition(QueryPersonBo queryPersonBo);

    public void insertPerson(PersonVo personVo);

    public void update(PersonVo personVo);
}
