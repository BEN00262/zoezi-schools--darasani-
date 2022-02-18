// the default models export

module.exports = {
    SchoolModel: require("./school"),
    SubjectModel: require("./subject"),
    TeacherModel: require("./teacher"),
    ClassModel: require("./class"),
    ClassRef:  require("./user"),
    specialPaperHistoryModel: require("./special_paper_history"),
    UserDataModel: require("./userDetails"),
    SubSubAccountModel: require("./sub_sub_account"),
    StudentModel: require("./student"),
    SecondTierModel:require('./SecondTier'),
    MultiLevelModel:require("./multi-level"),
    MidTierLevelModel: require("./midTier"),
    PricingModel: require("./pricingModels"),
    LibpaperModel: require("./libPapers"),
    SubscriptionModel: require("./subscription"),
    OnlineSchoolsModel: require("./OnlineSchools"),
    SpecialPaperModel: require("./specialPaper"),
    ...require("./ZoeziGrades")
}