import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from '../models/listItem';
import { Sticky } from '../models/sticky';

@Component({
  selector: 'app-take-note',
  templateUrl: './take-note.component.html',
  styleUrls: ['./take-note.component.css']
})
export class TakeNoteComponent implements OnInit {
  @Output() stickyEvent = new EventEmitter<void>();
  started: boolean;
  checked: boolean;
  @Input() sticky: any = { colorCode: "#D7EEF6" };

  constructor() {
    if (this.sticky.id > 0) {
      document.getElementById('title').focus();
      this.colorChange(this.sticky.colorCode);
      if (this.sticky.listItems) {
        this.checked = true;
        document.getElementById('checkSquare').classList.replace('text-danger', 'text-success');
        document.getElementById('checkSquare').title = "conver to single style";
      }
    }

  }

  ngOnInit(): void {
  }

  createSticky() { this.started = true; }
  createStickyBlur() { this.started = false; }
  changeChecked(checkSquare: any) {
    this.checked = !this.checked; 
    if (this.checked) {
      if (this.sticky.content != "" && this.sticky.content) {
        var tempArr = this.sticky.content.split('\n');
        this.sticky.listItems = [];
        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i] != "") {
            this.sticky.listItems.push({
              id: Number(i + 1),
              content: tempArr[i]
            });
          }
        }
        this.sticky.content = null;
      } 
      document.getElementById('listOfData').classList.remove('d-none');
      document.getElementById('newText').focus();
      document.getElementById('note').classList.add('d-none');

      checkSquare.title = "convert to single style";
      checkSquare.classList.replace('text-danger', 'text-success');
    }
    else{
      if (this.sticky.listItems) {
        this.sticky.content = "";
        for (let i = 0; i < this.sticky.listItems.length; i++) {
          this.sticky.content += this.sticky.listItems[i].content + '\n';
        }
        this.sticky.listItems = null;
      }

      document.getElementById('listOfData').classList.add('d-none');
      document.getElementById('note').classList.remove('d-none');
      document.getElementById('note').focus();

      checkSquare.title = "convert to list style";
      checkSquare.classList.replace('text-success', 'text-danger');
    }
  }
  addNewItem(value: string, item: any){
    if (value == "") {return}

    var id: number = 0;
    if(this.sticky.listItems && this.sticky.listItems.length > 0){
      id = Number(this.sticky.listItems[this.sticky.listItems.length - 1].id + 1);
    }

    if (!this.sticky.listItems) {
      this.sticky.listItems = [];
    }
    this.sticky.listItems.push({
      id: id,
      content: value
    });

    item.value = "";
  }
  deleteItem(id: number){
    var items: ListItem[] = []
    for (let i = 0; i < this.sticky.listItems.length; i++) {
      if (this.sticky.listItems[i].id != id) {
        items.push(this.sticky.listItems[i]);        
      }      
    }
    this.sticky.listItems = [];
    this.sticky.listItems = items;
  }

  reset(){
    this.sticky = {
      colorCode: "#D7EEF6"
    }

    document.getElementById('colorPickerIcon').title = `selected color: #D7EEF6`;
    document.getElementById('colorPickerIcon').style.color = "#D7EEF6";
  }
  createNewSticky(){
    if ((this.sticky.content == null || this.sticky.content == "" ) && (this.sticky.listItems == null || this.sticky.listItems.length == 0)) {
      alert("Please make a note");
      return;
    }
    var stickys = JSON.parse(localStorage.getItem("stickys")) as Sticky[];

    if (this.sticky.id > 0) {
      var id = 0;
      for (let i = 0; i < stickys.length; i++) {
        const sticky = stickys[i];
        if (sticky.id == this.sticky.id) {
          id = i;
          break;
        }        
      }
      
      stickys[id] = this.sticky;
      this.stickyEvent.emit();
      return;
    }

    if (stickys != null && stickys.length > 0 ) {
      var id = Number(stickys[stickys.length - 1].id + 1);
      this.sticky.id = id;
    }
    else{
      stickys = [];
      this.sticky.id = 1;
    }
    stickys.push(this.sticky);
    localStorage.setItem("stickys", JSON.stringify(stickys));
    this.reset();
    this.stickyEvent.emit();
  }

  colorChange(colorCode: string) { 
    document.getElementById('colorPickerIcon').title = `selected color: ${colorCode} !important`;
    document.getElementById('colorPickerIcon').style.color = colorCode;
    this.sticky.colorCode = colorCode;
  }
  runColorPicker(colorPicker: any) { colorPicker.click(); }
}
