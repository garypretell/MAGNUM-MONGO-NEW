import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidocumentoComponent } from './midocumento.component';

describe('MidocumentoComponent', () => {
  let component: MidocumentoComponent;
  let fixture: ComponentFixture<MidocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MidocumentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MidocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
