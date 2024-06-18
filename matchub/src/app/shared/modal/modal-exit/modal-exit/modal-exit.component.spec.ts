import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExitComponent } from './modal-exit.component';

describe('ModalExitComponent', () => {
  let component: ModalExitComponent;
  let fixture: ComponentFixture<ModalExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalExitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
