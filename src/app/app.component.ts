import { Component } from '@angular/core';
import { Sticky } from './models/sticky';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NoteApp';
  sticky: any = {colorCode: "#D7EEF6"};
  stickys: Sticky[];

  constructor(){
    this.getStikys();
  }

  getStikys(){
    this.stickys = JSON.parse(localStorage.getItem("stickys")) as Sticky[];
  }

  createNewSticky(sticky: Sticky){
    this.sticky = sticky;
  }
  deleteSticky(sticky: Sticky){
    var index = this.stickys.indexOf(sticky);
    if (index !== -1) {
      this.stickys.splice(index, 1);
    }

    localStorage.setItem("stickys", JSON.stringify(this.stickys));
    this.getStikys();
  }
}
