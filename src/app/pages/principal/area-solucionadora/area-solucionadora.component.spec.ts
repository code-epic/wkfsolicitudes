import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaSolucionadoraComponent } from './area-solucionadora.component';

describe('AreaSolucionadoraComponent', () => {
  let component: AreaSolucionadoraComponent;
  let fixture: ComponentFixture<AreaSolucionadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaSolucionadoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaSolucionadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
