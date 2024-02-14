import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaSupervisoraComponent } from './area-supervisora.component';

describe('AreaSupervisoraComponent', () => {
  let component: AreaSupervisoraComponent;
  let fixture: ComponentFixture<AreaSupervisoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaSupervisoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaSupervisoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
