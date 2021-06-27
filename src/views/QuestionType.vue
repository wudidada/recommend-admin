<template>
  <div style="padding: 10px">
    <div style="background: #fff; border-radius: 8px; padding: 20px">
      <Button type="primary" @click="addQuestionType">add question type</Button>
      <Modal
        v-model="isShowDialog"
        :title="isAddQuestionType ? 'add question type' : 'edit question type'"
        @on-ok="ok"
        @on-cancel="cancel"
      >
        <Form>
          <FormItem label="question type">
            <Input v-model="questionType" placeholder="question type" />
          </FormItem>

          <FormItem label="question desc">
            <Input v-model="desc" placeholder="question desc" />
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
              >edit</Button
            >
            <Button type="error" @click="remove(row, index)">delete</Button>
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
          title: "question type",
          key: "question_type"
        },
        {
          title: "question desc",
          key: "desc"
        },
        {
          title: "action",
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
            this.$Message.success("add success");
          })
          .catch(err => {
            console.log(err);
            this.$Message.error("add failed");
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
            this.$Message.success("update success");
          })
          .catch(err => {
            console.log("failed");
            console.log(err);
            this.$Message.error("update failed");
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
          this.$Message.success("delete success");
        })
        .catch(() => this.$Message.error("delete failed"));
    }
  },
  created() {
    this.getQuestionTypes();
  }
};
</script>

<style scoped>
</style>
