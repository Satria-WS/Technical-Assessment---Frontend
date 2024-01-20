import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeService } from '../services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../services/core.service';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.css'],
})
export class EmpAddEditComponent implements OnInit {
  salary: number = 0;
  today: Date = new Date();

  myControl = new FormControl('');
  options: string[] = [
    'Group-1',
    'Group-2',
    'Group-3',
    'Group-4',
    'Group-5',
    'Group-6',
    'Group-7',
    'Group-8',
    'Group-9',
    'Group-10',
  ];
  filteredOptions: Observable<string[]> = new Observable<string[]>();

  empForm: FormGroup;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService

  ) {
    this.empForm = this._fb.group({
      firstName: '',
      lastName: '',
      email: '',
      bod: '',
      status: ['' , Validators.required],
      group: this.myControl,
      salary: '',
      desc: '',
    });
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
    this.empForm.patchValue(this.data)

  }
  onFormSubmit() {
    if (this.empForm.valid) {
      if (this.data) {
        this._empService.editEmployee( this.data.id,this.empForm.value).subscribe({
          next: (val: any) => {

            this._coreService.openSnackBar('Employee edit successfully' , 'done')
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      } else {

        this._empService.addEmployee(this.empForm.value).subscribe({
          next: (val: any) => {

            this._coreService.openSnackBar('Employee added successfully' , 'done')
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }

      console.log(this.empForm.value);
    }
  }




}
