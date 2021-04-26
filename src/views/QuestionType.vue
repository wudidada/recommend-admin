<template>
  <div style="padding: 10px">
    <div style="background: #fff; border-radius: 8px; padding: 20px">
      <Button type="primary" @click="addQuestionType">添加问题类型</Button>
      <Modal
        v-model="isShowDialog"
        :title="isAddQuestionType ? '添加问题类型' : '编辑问题类型'"
        @on-ok="ok"
        @on-cancel="cancel"
      >
        <Form>
          <FormItem label="问题类型">
            <Input v-model="questionType" placeholder="问题类型" />
          </FormItem>

          <FormItem label="具体问题">
            <Input v-model="desc" placeholder="具体问题" />
          </FormItem>
        </Form>
      </Modal>
      <Table :columns="columns" :data="data" style="margin-top: 12px">
        <template slot-scope="{ row, index }" slot="action">
          <div>
            <Button
              type="primary"
              style="margin-right: 12px"
              @click="updateQuestionType(row, index)"
              >编辑</Button
            >
            <Button type="error" @click="remove(row, index)">删除</Button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import api from "../utils/api";

export default {
  data() {
    return {
      row: 0,
      isShowDialog: false,
      isAddQuestionType: false,
      columns: [
        {
          title: "问题类型",
          key: "question_type"
        },
        {
          title: "具体问题",
          key: "desc"
        },
        {
          title: "动作",
          slot: "action"
        }
      ],
      data: [],
      questionType: "",
      desc: "",
      _id: null
    };
  },
  methods: {
    ok() {
      if (this.isAddQuestionType) {
        api
          .addQuestionType({
            question_type: this.questionType,
            desc: this.desc
          })
          .then(response => {
            this._id = response._id;
            this.data.push({
              question_type: this.questionType,
              desc: this.desc,
              _id: this._id
            });
            this.$Message.success("添加成功");
          })
          .catch(err => {
            console.log(err);
            this.$Message.error("添加失败");
          })
          .finally(() => this.cancel());
      } else {
        api
          .updateQuestionType({
            question_type: this.questionType,
            desc: this.desc,
            _id: this._id
          })
          .then(() => {
            this.data.splice(this.row, 1, {
              question_type: this.questionType,
              desc: this.desc,
              _id: this._id
            });
            this.$Message.success("更新成功");
          })
          .catch(err => {
            console.log("failed");
            console.log(err);
            this.$Message.error("更新失败");
          })
          .finally(() => this.cancel());
      }
    },
    cancel() {
      this.isShowDialog = false;
      this.isAddQuestionType = false;
      this.questionType = "";
      this.desc = "";
      this._id = null;
    },
    addQuestionType() {
      this.showDialog();
      this.isAddQuestionType = true;
    },
    showDialog() {
      this.isShowDialog = true;
    },
    updateQuestionType(row, index) {
      this.row = index;
      this.questionType = row.question_type;
      this.desc = row.desc;
      this._id = row._id;
      this.showDialog();
    },
    getQuestionTypes() {
      api.getQuestionTypes().then(response => {
        console.log(response);
        this.data.push(...response);
      });
    },
    remove(row, index) {
      api
        .delQuestionType(row._id)
        .then(() => {
          this.data.splice(index, 1);
          this.$Message.success("删除成功");
        })
        .catch(() => this.$Message.error("删除失败"));
    }
  },
  created() {
    this.getQuestionTypes();
  }
};
</script>

<style scoped>
</style>
