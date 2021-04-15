import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilibroComponent } from './milibro.component';

describe('MilibroComponent', () => {
  let component: MilibroComponent;
  let fixture: ComponentFixture<MilibroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilibroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
