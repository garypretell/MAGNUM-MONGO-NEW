import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiplantillaComponent } from './miplantilla.component';

describe('MiplantillaComponent', () => {
  let component: MiplantillaComponent;
  let fixture: ComponentFixture<MiplantillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiplantillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiplantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
