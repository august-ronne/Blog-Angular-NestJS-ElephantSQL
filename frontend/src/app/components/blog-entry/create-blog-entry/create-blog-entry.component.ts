import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { BlogService } from 'src/app/services/blog/blog.service';
import { WINDOW } from 'src/app/window-token';

export interface File {
  data: any;
  progress: number;
  inProgress: boolean;
}

@Component({
  selector: 'app-create-blog-entry',
  templateUrl: './create-blog-entry.component.html',
  styleUrls: ['./create-blog-entry.component.scss'],
})
export class CreateBlogEntryComponent implements OnInit {
  origin = this.window.location.origin;

  form: FormGroup = new FormGroup({});
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  file: File = {
    data: null,
    progress: 0,
    inProgress: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{ value: null, disabled: true }],
      title: [null, [Validators.required]],
      slug: [{ value: null, disabled: true }],
      description: [null, [Validators.required]],
      body: [null, [Validators.required]],
      headerImage: [null],
    });
  }

  createNewBlogEntry(): void {
    this.blogService
      .createNewBlogEntry(this.form.getRawValue())
      .pipe(tap(() => this.router.navigate(['../'])))
      .subscribe();
  }

  onClickUploadHeaderImage(): void {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();
    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        progress: 0,
        inProgress: false,
      };
      this.fileUpload.nativeElement.value = '';
      this.uploadHeaderImage();
    };
  }

  uploadHeaderImage(): void {
    const formData = new FormData();
    formData.append('file', this.file.data);
    this.file.inProgress = true;
    this.blogService
      .uploadBlogEntryHeaderImage(formData)
      .pipe(
        map((event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.file.progress = Math.round(
                (event.loaded * 100) / event.total
              );
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.file.inProgress = false;
          return of(`Image upload failed: ${error.message}`);
        })
      )
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          this.form.patchValue({ headerImage: event.body.filename });
        }
      });
  }
}
