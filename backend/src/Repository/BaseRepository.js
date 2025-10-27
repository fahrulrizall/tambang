const { Op } = require("sequelize");

class BaseRepository {
  constructor(Model, Key) {
    this.Model = Model;
    this.Key = Key;
  }

  async pagedSearchResponseAsync(params) {
    try {
      const attributes = Object.keys(this.Model.rawAttributes);

      const whereCondition = attributes.reduce((acc, attribute) => {
        acc.push({
          [attribute]: {
            [Op.like]: `%${params.keyword}%`,
          },
        });
        return acc;
      }, []);

      const result = await this.Model.findAndCountAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: whereCondition,
            },
            params.where,
          ],
        },
        limit: parseInt(params.pageSize),
        offset: parseInt(params.pageSize * params.pageIndex),
        order: [[params.orderByFieldName, params.sortOrder]],
      });

      return {
        data: result.rows,
        totalCount: result.count,
      };
    } catch (error) {
      throw new Error(`Error in paged search: ${error.message}`);
    }
  }

  async ReadByIdAsync(id) {
    try {
      const result = await this.Model.findByPk(id);

      return { ...result.dataValues };
    } catch (error) {
      throw new Error(`Error in find one: ${error.message}`);
    }
  }

  async InsertAsync(request) {
    try {
      const created = await this.Model.create(request);

      const newData = created.toJSON();

      return { id: newData[this.Key] };
    } catch (error) {
      throw new Error(`Error in Insert: ${error.message}`);
    }
  }

  async DeleteByIdAsync(id) {
    try {
      const result = await this.Model.findByPk(id);

      if (!result) {
        return "Item not found.";
      }

      await result.destroy();
      return { id };
    } catch (error) {
      throw new Error(`Error in delete: ${error.message}`);
    }
  }

  async UpdateByIdAsync(id, request) {
    try {
      const result = await this.Model.findByPk(id);

      if (!result) {
        return "Item not found.";
      }

      await result.update(request);

      return { id };
    } catch (error) {
      throw new Error(`Error in Insert: ${error.message}`);
    }
  }

  async SelectAllWhereAsync(whereCondition) {
    try {
      const result = await this.Model.findAll({ where: whereCondition });

      return result;
    } catch (error) {
      throw new Error(`Error in find one: ${error.message}`);
    }
  }

  async SelectOneWhereAsync(whereCondition) {
    try {
      const result = await this.Model.findOne({ where: whereCondition });

      return { ...result.dataValues };
    } catch (error) {
      throw new Error(`Error in find one: ${error.message}`);
    }
  }

  async BulkInsertAsync(request) {
    try {
      const created = await this.Model.bulkCreate(request);

      return { success: created.length };
    } catch (error) {
      throw new Error(`Error in Insert: ${error.message}`);
    }
  }
}

module.exports = BaseRepository;
