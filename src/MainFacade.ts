import { Vue } from 'vue-property-decorator';

export default class MainFacade extends Vue {
    public static _instance:MainFacade;
    public app:any;
    public main:any;

    static getInstance() {
        if(MainFacade._instance == null){
            MainFacade._instance = new MainFacade();
        }

        return MainFacade._instance;
    }
}
