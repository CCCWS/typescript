// .bind()
// 호출하는 함수에 객체를 bind해주지 않으면 전역 객체로부터 값을 받아오려고 하기 때문에
// 원하는 값이아닌 다른값을 가지게됨
// function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.value;
//     const adjDescriptor: PropertyDescriptor = {
//       configurable: true,
//       get() {
//         const boundFn = originalMethod.bind(this);
//         return boundFn;
//       }
//     };
//     return adjDescriptor;
//   }
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//ProjectInput에서 값 입력후 버튼클릭 >
//ProjectState에서 전달 받은 데이터를 다시 전달 >
//ProjectList에서 랜더링
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
//project type class
//입력한 값을 클래스로 관리
var ProjectType = /** @class */ (function () {
    function ProjectType(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
    return ProjectType;
}());
var State = /** @class */ (function () {
    function State() {
        var _this = this;
        //ProjectList에서 받은 함수, 생성된 ProjectList만큼 추가됨
        this.listenerFunc = [];
        this.addListener = function (listenerFunc) {
            //activ와 finished 두개의 클래스가 생성되어 두번 호출
            //ProjectList의 assigne() 180
            _this.listenerFunc.push(listenerFunc);
        };
    }
    return State;
}());
//state manage class
//항목에 추가될 리스트를 관리
var ProjectState = /** @class */ (function (_super) {
    __extends(ProjectState, _super);
    function ProjectState() {
        var _this = _super.call(this) || this;
        _this.projects = []; //[title, desc, people]로 구성된 튜플
        //입력받은 값들을 클래스를 만들어 저장
        _this.addProject = function (title, description, people) {
            var newProject = new ProjectType(String(new Date().getTime()), title, description, people, ProjectStatus.Active);
            _this.projects.push(newProject);
            //ProjectList에서 실제로 DOM에 랜더링을 해줌
            //activ와 finished 클래스에 하나씩 랜더링됨
            for (var _i = 0, _b = _this.listenerFunc; _i < _b.length; _i++) {
                var listenerFunc = _b[_i];
                //for of문 > 받은 배열의 값을 순환, 배열에만 사용가능
                //for in문 > 객체를 순환, 배열을 받을시 배열의 index출력
                listenerFunc(
                //ProjectList클래스의 assigne함수
                _this.projects.slice(_this.projects.length - 1, _this.projects.length));
            }
        };
        return _this;
    }
    var _a;
    _a = ProjectState;
    //method//
    //singleton
    ProjectState.getInstance = function () {
        if (_a.instance) {
            return _a.instance;
        }
        _a.instance = new ProjectState();
        return _a.instance;
        //생성이 되어있다면 그대로 리턴 없으면 생성
        //외부에서 클래스 생성불가
    };
    return ProjectState;
}(State));
//ProjectList와 ProjectInput의 공통기능 관리
var Component = /** @class */ (function () {
    function Component(templateId, //template의 id
    hostElementId, //생성될 요소의 부모의 id
    insert, // afterbegin or beforeend
    newElementId //생성될 요소의 id
    ) {
        var _this = this;
        //template를 dom에 랜더링
        //insertAdjacentElement
        //innerHTML보다 빠르며 요소를 재분석하지 않고 내부의 기존 요소를 방해하지 않음
        //beforeend > element 안에 가장 마지막 child
        //afterbegin > element 안에 가장 첫번째 child
        this.attacth = function (insert) {
            _this.hostElement.insertAdjacentElement(insert ? "afterbegin" : "beforeend", _this.element);
        };
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        // ! > null조건 완화, 값이 있다는것을 전달
        // 타입변경을 통해 null이 아니라는것을 보장
        //document.importNode
        //현재 문서가 아닌 외부 문서의 노드를 복사하여 현재 문서에 넣음
        //true시 자식요소를 포함하여 가져옴
        var importNode = document.importNode(this.templateElement.content, true);
        //template의 첫번째 자식노드
        this.element = importNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attacth(insert);
    }
    return Component;
}());
//ProjectItem Class
//입력값을 리스트에 추가하여 랜더링할 클래스
var ProjectItem = /** @class */ (function (_super) {
    __extends(ProjectItem, _super);
    function ProjectItem(hostId, project) {
        var _this = 
        //hostId > active-projects or finished-project
        _super.call(this, "single-project", hostId, true, project.id) || this;
        _this.configure = function () { };
        _this.renderContent = function () {
            //랜더링할 목록
            //element > 부모 노드의 id > active-projects or finished-project
            _this.element.querySelector("h2").textContent = _this.project.title;
            _this.element.querySelector("p").textContent = _this.project.description;
            _this.element.querySelector("h3").textContent =
                _this.project.people.toString() + "명";
        };
        _this.project = project;
        _this.configure();
        _this.renderContent();
        return _this;
    }
    return ProjectItem;
}(Component));
//ProjectList Class
//active, finished 카테고리 생성
var ProjectList = /** @class */ (function (_super) {
    __extends(ProjectList, _super);
    //DOM에 랜더링할 데이터
    function ProjectList(status) {
        var _this = _super.call(this, "project-list", "app", false, "".concat(status, "-projects")) || this;
        _this.status = status;
        _this.renderProjects = function () {
            var list = document.getElementById("".concat(_this.status, "-project-list"));
            for (var _i = 0, _b = _this.itemArr; _i < _b.length; _i++) {
                var item = _b[_i];
                new ProjectItem(_this.element.querySelector("ul").id, item);
                //   const listItem = document.createElement("li");
                //   listItem.textContent = `
                //     TITLE : ${item.title} /
                //     DESC : ${item.description} /
                //     PEOPLE : ${item.people}`;
                //   list.appendChild(listItem);
                //   item의 값이 들어있는 li를 this.state-projects > ul의 자식노드로 추가
            }
        };
        _this.renderContent = function () {
            //template의 요소의 값을 추가
            var listId = "".concat(_this.status, "-projects-list");
            _this.element.querySelector("ul").id = listId; //ul의 id입력
            _this.element.querySelector("h2").textContent =
                _this.status.toLocaleUpperCase(); //클래스 생성시 입력된 값
        };
        _this.configure = function () {
            projectState.addListener(_this.assigne);
        };
        _this.assigne = function (projects) {
            // projects > ProjectState에서 보내준 입력값 데이터
            var projectFillter = projects.filter(function (projects) {
                //active, finished 상태 필터링
                if (_this.status === "active") {
                    //active 클래스일 경우
                    //상태가 active인 데이터만 남김
                    return projects.status === ProjectStatus.Active;
                }
                //finished 클래스일 경우
                //상태가 finished인 데이터만 남김
                return projects.status === ProjectStatus.Finished;
            });
            _this.itemArr = projectFillter;
            _this.renderProjects();
        };
        _this.itemArr = [];
        _this.configure();
        _this.renderContent();
        return _this;
    }
    return ProjectList;
}(Component));
//input class
//입력 카테고리 생성
var ProjectInput = /** @class */ (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput() {
        var _this = _super.call(this, "project-input", "app", true, "user-input") || this;
        //method//
        _this.userInput = function () {
            //input의 값들을 모두 가져옴
            var titleInput = _this.titleInput.value;
            var descriptionInput = _this.descriptionInput.value;
            var peopleInput = _this.peopleInput.value;
            if (
            //trim() 문자열 양끝의 공백 제거
            titleInput.trim().length === 0 ||
                descriptionInput.trim().length === 0 ||
                peopleInput.trim().length === 0) {
                alert("error");
                return;
            }
            else {
                return [titleInput, descriptionInput, parseInt(peopleInput)];
            }
        };
        _this.clearInput = function () {
            _this.titleInput.value = "";
            _this.descriptionInput.value = "";
            _this.peopleInput.value = "";
        };
        // @autobind
        _this.submitHendler = function (e) {
            e.preventDefault();
            var userInput = _this.userInput();
            if (Array.isArray(userInput)) {
                var title = userInput[0], desc = userInput[1], people = userInput[2];
                projectState.addProject(title, desc, people);
            }
            // this.clearInput();
        };
        _this.renderContent = function () { };
        _this.configure = function () {
            _this.element.addEventListener("submit", _this.submitHendler);
        };
        //해당 ID가 inputElement인것을 보장하기위해 형변환 필요
        //form의 자식노드인 input에 접근
        _this.titleInput = _this.element.querySelector("#title");
        _this.descriptionInput = _this.element.querySelector("#description");
        _this.peopleInput = _this.element.querySelector("#people");
        _this.renderContent();
        _this.configure();
        return _this;
    }
    return ProjectInput;
}(Component));
var projectState = ProjectState.getInstance();
var projectInput = new ProjectInput();
var ProjectList1 = new ProjectList("active");
var ProjectList2 = new ProjectList("finished");
