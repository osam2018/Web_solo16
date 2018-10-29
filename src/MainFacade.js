import { Vue } from 'vue-property-decorator';
export default class MainFacade extends Vue {
    static getInstance() {
        if (MainFacade._instance == null) {
            MainFacade._instance = new MainFacade();
        }
        return MainFacade._instance;
    }
}
//# sourceMappingURL=MainFacade.js.map