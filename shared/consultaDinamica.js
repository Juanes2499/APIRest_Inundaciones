const consultaDinamica = (queryBase, Select, Where, GroupBy, OrderBy) => {
    
    let select = Select;
    let where =  Where;
    let groupBy = GroupBy;
    let orderBy = OrderBy;

    const lengthWhere = Object.keys(where).length;
    
    if(select.length === 0){
        select = "*";
        select.toUpperCase();
    }

    if(lengthWhere === 0){
        where = "";
    }else if(lengthWhere > 0){

        let whereArray = [];
        
        let whereKeys = Object.keys(where);
        let whereValues = Object.values(where);

        for (var i = 0; i < lengthWhere; i++) {
            whereArray.push(`${whereKeys[i].toUpperCase()} = '${whereValues[i]}'`);
        }

        where =  `WHERE ${whereArray.toString()}`;
    }

    if(groupBy.length === 0){
        groupBy = "";
    }else if(groupBy.length > 0){
        groupBy = `GROUP BY ${groupBy.toUpperCase()}`;
    }

    if(orderBy.length === 0){
        orderBy = "";
    }else if(orderBy.length > 0){
        orderBy = `ORDER BY ${orderBy.toUpperCase()}`;
    }

    const queryConsultadDinamica = `
        SELECT ${select} FROM (
            ${queryBase}
            ) SWS 
        ${where}
        ${groupBy}
        ${orderBy}
    `;

    return queryConsultadDinamica;
}

module.exports = consultaDinamica;